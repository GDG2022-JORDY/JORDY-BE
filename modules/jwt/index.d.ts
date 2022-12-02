import {Request, Response, NextFunction} from "express";

declare namespace jwt {
    export const private_key: string;
    export const public_key: string;
    export const refresh_priv_key: string;
    export const refresh_pub_key: string;
    export function verifyToken(req:Request, res:Response, next:NextFunction): any;
}

export = jwt;