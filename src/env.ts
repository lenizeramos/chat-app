import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const HOST = process.env.HOST || 'localhost';

export const SECRET = process.env.SECRET || "My secret value";
export const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE || 1000 * 60 * 60 * 24;