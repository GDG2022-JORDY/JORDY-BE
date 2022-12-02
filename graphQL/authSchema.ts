import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from "../models";
import { redisCli } from "../modules/redis/redis";
import { buildSchema, GraphQLSchema } from 'graphql';
import { transport } from "../modules/mail/mail.transport";
import { private_key, refresh_priv_key } from "../modules/jwt";

const SUCCESS: string = 'success';
const USER_NOT_FOUND: string = 'user not found';
const PASSWORD_NOT_MATCH: string = 'password not match';

export const auth_schema: GraphQLSchema = buildSchema(`
    type Query {
        login(email: String!, pwd: String!): String
    }
    
    type Mutation {
        sendVerifyCode(email: String!): String
        verifyEmail(email: String!, code: String!): String
        createUser(email: String!, pwd: String!, name: String!, tags: [Int]!): String
    }
`)

export const auth_resolver = {
    sendVerifyCode: async (args: any, context: any, info: any): Promise<string> => {
        const { email } = args;
        let result: string;

        const n = await redisCli.exists(email);
        if (n) await redisCli.del(email);

        if ((await Users.findOne({where: {email}})) !== null) return "User already exists";

        let code: string = Math.random().toString(36).substring(2, 8);
        for (let i = 0; i < code.length; i++) {
            if (Math.random() > 0.5) {
                code = code.substring(0, i) + code.substring(i, i + 1).toUpperCase() + code.substring(i + 1);
            }
        }

        try {
            transport.sendMail({
                from: 'Jordi',
                to: email,
                subject: '[Jordi] 이메일 인증번호가 도착했습니다.',
                html: `
                <table style="margin:auto; text-align:center; padding:0; border-spacing:0; border:0; border-collapse:collapse; width:600px;">
                    <tr>
                        <td style="text-align: center; padding-top: 50px;">
                            <img style="width:90px;height:90px" src="https://cdn.jsdelivr.net/gh/op06072/outbox_resource@main/KakaoTalk_Photo_2022-11-16-11-21-19.png" alt="Logo" />
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 30px;text-align: center;padding-top: 10px;">
                            Welcome to Jordi!
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 20px;text-align: center;color: #919191; padding-top: 15px; padding-bottom: 40px;">
                            아래의 인증코드를 사용해 회원가입을 진행해주세요.
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;  background-color: #f5f5f5;font-size: 32px; border-radius: 8px; padding-top: 20px;padding-bottom: 20px;padding-right: 60px;padding-left: 60px;">
                            ${code}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 20px;text-align: center;color: #919191; padding-top: 40px;padding-bottom: 70px;">
                            Jordi
                        </td>
                    </tr>
                </table>`
            });
            await redisCli.set(email, code, { EX: 60 * 5});
            result = "send requested";
        } catch (err) {
            context.res.status(400);
            result = "fail";
        }
        return result;
    },
    verifyEmail: async(args: any, context: any, info: any): Promise<string> => {
        const { email, code } = args;
        const res = context.res;

        const saved_code: string = await redisCli.get(email, code);
        if (saved_code !== code) {
            res.status(412);
            return "invalid code";
        } else {
            await redisCli.del(email);
            await redisCli.set(email, 'verified', { EX: 60 * 3 });
            if (await Users.findOne({where: {email}})) {
                res.status(400);
                return "User already exists";
            }
        }
        return SUCCESS;
    },
    createUser: async (args: any, context: any, info: any): Promise<string> => {
        const {name, email, pwd, tags} = args;
        const res = context.res;

        let resultVal: string = '';
        const salt: string = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(pwd, salt);
        if (await redisCli.get(email) !== 'verified') {
            res.status(412);
            resultVal = 'unverified email';
        } else {
            await redisCli.del(email);
            await Users.create({
                email: email,
                password: hashed_pwd,
                name: name,
                tag: tags.map((any: { toString: () => any; }) => any.toString()).join()
            }).then((result) => {
                console.log(result);
                res.status(200);
                resultVal = SUCCESS;
            }).catch((err) => {
                console.log(err);
                res.status(400);
                resultVal = err;
            });
        }

        return resultVal;
    },
    login: async (args: any, context: any, info: any): Promise<string> => {
        const {email, pwd} = args;
        const res = context.res;

        const usr = await Users.findOne({where: {email}});
        if (usr === null) {
            res.status(400);
            return USER_NOT_FOUND;
        }
        const user = usr.dataValues
        if (!await bcrypt.compare(pwd, user.password)) {
            res.status(400);
            return PASSWORD_NOT_MATCH;
        }
        const token = jwt.sign(
            {_id: user.id, name: user.name, email: user.email, tag: user.tag},
            private_key, {algorithm: 'HS512', expiresIn: '1h'}
        )
        const refresh_token = jwt.sign(
            {_id: user.id, name: user.name, email: user.email, tag: user.tag},
            refresh_priv_key, {algorithm: 'HS512', expiresIn: '14d'}
        )
        Users.update({refresh_token}, {where: {email}}).then((result) => {
            console.log("토큰 재발급 완료");
        }).catch((err) => {
           console.log(err);
        });
        const tag: number[] | undefined = user.tag?.split(',').map((str) => Number(str));
        res.cookie('token', token, {httpOnly: true});
        res.cookie('refresh_token', refresh_token, {httpOnly: true});
        res.cookie('tag', tag, {httpOnly: true});
        return SUCCESS;
    }
}
