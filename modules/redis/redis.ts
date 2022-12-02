import * as redis from 'redis';
import env from '../../env';

const URI: string = env.REDIS_URI || "localhost";
const PORT: string = env.REDIS_PORT || "6379";
const PASSWORD: string = env.REDIS_PASSWORD || "";

const redisClient = redis.createClient({
    url: `redis://${URI}:${PORT}/0`,
    password: PASSWORD,
    legacyMode: true,
});
redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});
redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error : ', err);
});
redisClient.connect().then();
export const redisCli = redisClient.v4;