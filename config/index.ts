import fs from 'fs';
import env from '../env';

interface dbConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: string;
}

const envconfig: dbConfig = {
    username: env.MYSQL_USER as string,
    password: env.MYSQL_PASSWORD as string,
    database: env.MYSQL_DATABASE as string,
    host: env.MYSQL_HOST as string,
    port: parseInt(env.MYSQL_PORT as string),
    dialect: 'mysql'
}

const conf: { [index: string]: dbConfig } = {
    "development": envconfig,
    "docker": envconfig,
    "production": envconfig,
    "test": envconfig,
};

export default conf;
