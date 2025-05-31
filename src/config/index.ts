import { config } from 'dotenv';
config();

export default {
    PORT: Number(process.env.PORT),
    PG_HOST: String(process.env.PG_HOST),
    PG_PORT: Number(process.env.PG_PORT),
    PG_USER: String(process.env.PG_USER),
    PG_PASS: String(process.env.PG_PASS),
    PG_DB: String(process.env.PG_DB),
    ACCESS_TOKEN_KEY: String(process.env.ACCESS_TOKEN_KEY),
    ACCESS_TOKEN_TIME: String(process.env.ACCESS_TOKEN_TIME),
    REFRESH_TOKEN_KEY: String(process.env.REFRESH_TOKEN_KEY),
    REFRESH_TOKEN_TIME: String(process.env.REFRESH_TOKEN_TIME),
    MAIL_HOST: String(process.env.MAIL_HOST),
    MAIL_PORT: Number(process.env.MAIL_PORT),
    MAIL_USER: String(process.env.MAIL_USER),
    MAIL_PASS: String(process.env.MAIL_PASS),
    ADMIN_FULL_NAME: String(process.env.ADMIN_FULL_NAME),
    ADMIN_EMAIL: String(process.env.ADMIN_EMAIL),
    ADMIN_PHONE: String(process.env.ADMIN_PHONE),
    ADMIN_PASSWORD: String(process.env.ADMIN_PASSWORD)
}
