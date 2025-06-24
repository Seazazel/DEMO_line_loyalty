import * as dotenv from 'dotenv';
dotenv.config();

const HOTSPOT_API_BASE_URL = process.env.HOTSPOT_API_BASE_URL || '';

if (!HOTSPOT_API_BASE_URL) {
  throw new Error('HOTSPOT_API_BASE_URL is not defined in the environment variables.');
}

export const hotspotAPIConfig = {
  hotspotURL: HOTSPOT_API_BASE_URL,
};
