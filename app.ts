import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from "cookie-parser";
import {verifyToken} from "./modules/jwt";
import { sequelize } from './models/';
import {graphqlHTTP} from 'express-graphql';
import {schema, resolver} from "./graphQL/schema";
import {Request, Response, NextFunction} from "express";
import {graphqlUploadExpress} from "graphql-upload-minimal";
import { auth_schema, auth_resolver } from "./graphQL/authSchema";

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'docker') {
    dotenv.config({ path: '.env.docker' });
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.test' });
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const HOST: string = process.env.HOST || '0.0.0.0';
const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let graphiql: boolean = false;
if (process.env.GRAPHIQL === 'true') {
    graphiql = true
}

app.use('/graphauth', (req, res) => {
    return graphqlHTTP({
        schema: auth_schema,
        rootValue: auth_resolver,
        graphiql: graphiql,
        context: { req, res }
    })(req, res);
});

app.use('/graphuser', (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next);
});
app.use('/graphuser', (req: Request, res: Response) => {
    return graphqlHTTP({
        schema: schema,
        rootValue: resolver,
        graphiql: graphiql,
        context: { req, res }
    })(req, res);
});

app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
)

app.listen(PORT, HOST, async () => {
    const public_ip = await fetch("https://api.ipify.org").then(res => res.text());
    console.log(`Server Listening on ${HOST}:${PORT} or ${public_ip}:${PORT}`);

    await sequelize.authenticate()
        .then(() => {
            console.log('connection success');
        })
        .catch((err: Error) => {
            console.error('connection failed: ', err);
        });
})
