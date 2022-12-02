import nodemailer from 'nodemailer';
import env from '../../env';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: env.MAIL_ID,
        pass: env.MAIL_PW
    }
});