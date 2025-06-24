import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { replyText } from 'src/message/functions/replyFunction';
import {
  getUserPassCache,
  setUserPassCache,
  getUserSession,
  setUserSession,
  clearUserSession,
} from 'src/hotspot/session/userSession.store';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';

const CACHE_EXPIRY_MS = 2 * 60 * 1000; // 1 hour

// === MAIN ENTRY FUNCTION ===
export async function handleUserAccess(
  client: Client,
  replyToken: string,
  userId: string,
  destination: string,
): Promise<void> {
  // Store session awaiting branch input
  setUserSession(userId, {
    action: 'requestWifi',
    step: 'awaitingBranchId',
    profileId: '1', // can modify if dynamic later
  });

  await replyText(client, replyToken, 'โปรดกรอกรหัสสาขาที่ต้องการ');
}

function isCacheValid(cached: { cachedAt: Date } | null | undefined): boolean {
  return !!cached && new Date().getTime() - cached.cachedAt.getTime() <= CACHE_EXPIRY_MS;
}

async function fetchUserCredentials(
  httpService: HttpService,
  userId: string,
  profileId: string,
  destination: string,
  branchId: string,
): Promise<{ username?: string; password?: string }> {
  const formattedDate = new Date().toISOString();
  const hotspotURL = hotspotAPIConfig.hotspotURL;

  const response = await firstValueFrom(
    httpService.post(`${hotspotURL}/userRequestUserPass`, {
      user: { 
        userId, 
        profileId, 
        destination, 
        branchId 
      },
      content: { 
        formattedDate 
      },
    }),
  );

  return response.data || {};
}

async function checkSpamUsageLog(
  httpService: HttpService,
  userId: string,
  profileId: string,
  destination: string,
  branchId: string,
): Promise<boolean> {
  const formattedDate = new Date().toISOString();
  const hotspotURL = hotspotAPIConfig.hotspotURL;

  console.error("SPAMMED")
  const response = await firstValueFrom(
    httpService.post(`${hotspotURL}/spamUsageLog`, {
      user: { 
        userId, 
        profileId, 
        destination, 
        branchId 
      },
      content: { 
        formattedDate 
      },
    }),
  );

  return response.data?.Text === 'Not Exceed Hour';
}


// === CALLED AFTER USER TYPED BRANCH ===
export async function handleUserBranchInput(
  httpService: HttpService,
  client: Client,
  replyToken: string,
  userId: string,
  destination: string,
  message: string,
): Promise<boolean> {
  const session = getUserSession(userId);

  if (session?.step === 'awaitingBranchId' && session.action === 'requestWifi') {
    clearUserSession(userId);
    const profileId = session.profileId || '1';
    const branchId = message.trim();
    const cacheKey = `${userId}:${branchId}`;
    const cached = getUserPassCache(cacheKey);

    if (!isCacheValid(cached)) {
      try {
        const { username, password } = await fetchUserCredentials(
          httpService,
          userId,
          profileId,
          destination,
          branchId,
        );

        if (username && password) {
          setUserPassCache(cacheKey, { username, password, cachedAt: new Date() });
          await replyText(client, replyToken, `Username: ${username}\nPassword: ${password}`);
        } else {
          await replyText(client, replyToken, 'ไม่พบข้อมูลบัญชีผู้ใช้ในขณะนี้');
        }
      } catch (err: any) {
        console.error('fetchUserCredentials error:', err.message);
        await replyText(client, replyToken, 'ไม่สามารถดึงข้อมูลบัญชีผู้ใช้ได้ในขณะนี้ 😢');
      }
    } else {
      try {
  const allowed = await checkSpamUsageLog(
    httpService,
    userId,
    profileId,
    destination,
    branchId,
  );

  if (allowed && cached) {
    await replyText(
      client,
      replyToken,
      `Username (cached): ${cached.username}\nPassword (cached): ${cached.password}`,
    );
  } else {
    await replyText(client, replyToken, 'เกิดข้อผิดพลาดขณะตรวจสอบข้อมูล โปรดลองใหม่');
  }

} catch (err: any) {
  console.error('checkSpamUsageLog error:', err.message);
  await replyText(client, replyToken, 'ไม่สามารถตรวจสอบข้อมูลได้ในขณะนี้ 😢');
}
    }

    return true;
  }

  return false;
}