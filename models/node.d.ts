declare namespace NodeJS {
    interface Process {
        isServer: boolean;
    }
    interface ProcessEnv {
        NODE_ENV: string,
        MYSQL_USER: string,
        MYSQL_PASSWORD: string,
        MYSQL_DATABASE: string,
        MYSQL_HOST: string,
        MYSQL_PORT: string,
    }
}