import dotenv from 'dotenv';

dotenv.config();

const HOTSPOT_API = process.env.HOTSPOT_API || '';

if (!HOTSPOT_API) {
  throw new Error('HOTSPOT_API_BASE_URL is not defined in the environment variables.');
}

export const hotspotAPIConfig = {
  baseURL: process.env.HOTSPOT_API_BASE_URL || '',
};