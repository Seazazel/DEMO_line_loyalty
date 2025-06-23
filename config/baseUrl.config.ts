import * as dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.BASE_URL!;

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not defined in .env');
}

