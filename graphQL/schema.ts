import bcrypt from "bcrypt";
import {buildSchema, GraphQLSchema} from 'graphql';
import {Users} from "../models";
import {private_key} from "../modules/jwt";
import jwt, {JwtPayload} from "jsonwebtoken";
import {fn, col} from "sequelize";

const SUCCESS = 'success';
const USER_NOT_FOUND = 'user not found';
const PASSWORD_NOT_MATCH = 'password not match';

export const schema: GraphQLSchema = buildSchema(`
    type User {
        name: String!
        email: String!
        role: Int!
        position: Int
        createdAt: String!
        updatedAt: String!
    }
    
    type listedUser {
        name: String!
        email: String!
        position: Int
    }
    
    type Query {
        users: [listedUser]
        user(name: String, email: String): User
    }
    
    type Mutation {
        removeUser(email: String!, pwd: String!): String
        updatePwd(email: String!, pwd: String!, new_pwd: String!): String
    }
`);

async function userVerify(email: string, pwd: string, token: string, user: Users | null, admin: boolean): Promise<[number, string]> {
    let result: [number, string] = [200, SUCCESS];
    const decoded: JwtPayload = jwt.verify(token, private_key) as JwtPayload;
    if (!user) {
        result = [404, USER_NOT_FOUND];
    } else if (decoded.email !== email || (admin && decoded.role === 127)) {
        result = [401, 'you can only access your own information'];
    } else if (!await bcrypt.compare(pwd, user.password)) {
        result = [401, PASSWORD_NOT_MATCH];
    }
    return result;
}

export const resolver = {
    users: async (args: any, context: any, info: any): Promise<any> => {
        return await Users.findAll({
            attributes: ['name', 'email', 'position']
        });
    },
    user: async (args: any, context: any, info: any): Promise<Users | null | string> => {
        const res = context.res;
        const {name, email} = args;
        const token: string = context.req.cookies.token;
        let result: Users | null | string = null;
        if (token === undefined) {
            res.status(401);
            return 'you need to login first';
        } else {
            const decoded: JwtPayload = jwt.verify(token, private_key) as JwtPayload;
            if (decoded.role === 127 || email === decoded.email || name === decoded.name) {
                if (name !== undefined) {
                    result = await Users.findOne({
                        where: {name},
                        attributes: {
                            include: [
                                [
                                    fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'),
                                    "createdAt"
                                ], [
                                    fn('DATE_FORMAT', col('updatedAt'), '%Y-%m-%d %H:%i:%s'),
                                    "updatedAt"
                                ]
                            ]
                        }
                    });
                } else if (email !== undefined) {
                    result = await Users.findOne({
                        where: {email},
                        attributes: {
                            include: [
                                [
                                    fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'),
                                    "createdAt"
                                ], [
                                    fn('DATE_FORMAT', col('updatedAt'), '%Y-%m-%d %H:%i:%s'),
                                    "updatedAt"
                                ]
                            ]
                        }
                    });
                }
            } else {
                res.status(400);
                return "please provide name or email";
            }
        }
        return result;
    },
    removeUser: async (args: any, context: any, info: any): Promise<string> => {
        const res = context.res;
        const {email, pwd} = args;
        const user = await Users.findOne({where: {email}});
        const token: string = context.req.cookies.token;
        if (token === undefined) {
            res.status(401);
            return 'you need to login first';
        } else {
            const verified: [number, string] = await userVerify(email, pwd, token, user,true);
            if (verified[0] !== 200) {
                res.status = verified[0];
                return verified[1];
            }
        }

        let result_msg: string = '';
        await Users.destroy({where: {email}}).then(() => {
            context.res.clearCookie('token');
            context.res.clearCookie('refresh_token');
            console.log('user removed');
            res.status(200);
            result_msg = SUCCESS;
        }).catch((err) => {
            console.log(err);
            res.status(500);
            result_msg = "Internal Server Error";
        });

        return result_msg;
    },
    updatePwd: async (args: any, context: any, info: any): Promise<string> => {
        const res = context.res;
        const {email, pwd, new_pwd} = args;
        if (pwd === new_pwd) {
            res.status(400);
            return "new password can't be the same as old password";
        }
        const user = await Users.findOne({where: {email}});
        if (user === null) return USER_NOT_FOUND;
        const token: string = context.req.cookies.token;
        if (token === undefined) {
            res.status(401);
            return 'you need to login first';
        } else {
            const verified: [number, string] = await userVerify(email, pwd, token, user, true);
            if (verified[0] !== 200) {
                res.status = verified[0];
                return verified[1];
            }
        }

        let result_msg: string = '';
        const salt = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(new_pwd, salt);
        await Users.update({password: hashed_pwd}, {where: {email}}).then(() => {
            console.log('user password updated');
            res.status(200);
            result_msg = SUCCESS;
        }).catch((err) => {
            console.log(err);
            res.status(500);
            result_msg = "Internal Server Error";
        });
        return result_msg;
    }
}