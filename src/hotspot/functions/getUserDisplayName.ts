import { Client } from '@line/bot-sdk';

/**
 * Get LINE user's display name from userId.
 */
export async function getUserDisplayName(client: Client, userId: string): Promise<string> {
  try {
    const profile = await client.getProfile(userId);
    return profile.displayName;
  } catch (error: any) {
    console.error(`❌ Failed to fetch LINE user profile for ${userId}:`, error.message || error);
    return 'ผู้ใช้ไม่ทราบชื่อ'; // Fallback in Thai
  }
}
