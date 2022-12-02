import {Sequelize} from "sequelize";
import conf from "../config/index";
import env from "../env";

const environ: string = env.NODE_ENV || 'development';
const config = conf[environ];

export const sequelize: Sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
    }
);