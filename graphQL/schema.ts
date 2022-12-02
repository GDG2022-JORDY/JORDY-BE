import bcrypt from "bcrypt";
import {buildSchema, GraphQLSchema} from 'graphql';
import {Users} from "../models";
import {Recruits} from "../models";
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
        tags: [Int]!
        createdAt: String!
        updatedAt: String!
    }
    
    type Recruit {
        name: String!
        title: String!
        content: String!
        event: String!
        location: String!
        eventDate: String!
        createdAt: String!
    }
    
    type listedUser {
        name: String!
        email: String!
        tag: String!
    }
    
    type Query {
        users: [listedUser]
        user(name: String, email: String): User
        contents: [Recruit]
        content: Recruit
    }
    
    type Mutation {
        createContent(title: String!, content: String!, event: String!, location: String!, date: String!): String
    }
`);

export const resolver = {
    users: async (args: any, context: any, info: any): Promise<any> => {
        return await Users.findAll({
            attributes: ['name', 'email', 'tag']
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
    contents: async (args: any, context: any, info: any): Promise<Recruits[]> => {
        return await Recruits.findAll({
            attributes: {
                include: [
                    [
                        fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'),
                        "createdAt"
                    ]
                ]
            }
        });
    },
    content: async (args: any, context: any, info: any): Promise<Recruits | null | string> => {
        const res = context.res;
        const {title} = args;
        const token: string = context.req.cookies.token;
        let result: Recruits | null = null;
        if (token === undefined) {
            res.status(401);
            return 'you need to login first';
        } else {
            const decoded: JwtPayload = jwt.verify(token, private_key) as JwtPayload;
            if (decoded.role === 127 || title !== undefined) {
                result = await Recruits.findOne({
                    where: {title},
                    attributes: {
                        include: [
                            [
                                fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'),
                                "createdAt"
                            ]
                        ]
                    }
                });
            } else {
                res.status(400);
                return "please provide title";
            }
        }
        return result;
    },
    createContent: async (args: any, context: any, info: any): Promise<string> => {
        const res = context.res;
        const {title, content, event, location, date} = args;
        const token: string = context.req.cookies.token;
        let result: string = SUCCESS;
        if (token === undefined) {
            res.status(401);
            result = 'you need to login first';
        } else {
            const decoded: JwtPayload = jwt.verify(token, private_key) as JwtPayload;
            await Recruits.create({
                name: decoded.name,
                title: title,
                content: content,
                event: event,
                location: location,
                eventDate: date
            });
        }
        return result;
    }
}