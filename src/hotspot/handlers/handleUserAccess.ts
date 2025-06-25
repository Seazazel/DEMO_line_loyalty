import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { replyText } from 'src/message/functions/replyFunction';
import { getUserPassCache, setUserPassCache, getUserSession, setUserSession, clearUserSession, } from 'src/hotspot/session/userSession.store';
import { getWiFi, spamGetWiFi } from 'src/hotspot/functions/hotspot.api';


const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 min
//const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// === MAIN ENTRY FUNCTION ===
export async function handleUserAccess(client: Client, replyToken: string, userId: string, destination: string,): Promise<void> {

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

    // request Exceed 1 hr
    if (!isCacheValid(cached)) {
      try {
        const { username, password } = await getWiFi(httpService, userId, profileId, destination, branchId,);

        if (username && password) {
          setUserPassCache(cacheKey, { username, password, cachedAt: new Date() });
          await replyText(client, replyToken, `Username: ${username}\nPassword: ${password}`);
        } else {
          await replyText(client, replyToken, 'ไม่พบ Username และ Password');
        }
      } catch (err: any) {
        console.error('getWiFi branch error:', err.message);
        await replyText(client, replyToken, 'สาขาไม่ถูกต้อง กรุณากดขอใหม่อีกครั้ง');
      }
    }

    // request Not Exceed 1 hr
    else {
      try {
        const allowed = await spamGetWiFi(httpService, userId, profileId, destination, branchId,);

        if (allowed && cached) {
          await replyText(
            client,
            replyToken,
            `Username (cached): ${cached.username}\nPassword (cached): ${cached.password}`,
          );
        } else {
          await replyText(client, replyToken, 'ไม่สามารถ');
        }

      } catch (err: any) {
        console.error('spamGetWiFi error:', err.message);
        await replyText(client, replyToken, 'ไม่สามารถตรวจสอบข้อมูลได้ในขณะนี้ 😢');
      }
    }

    return true;
  }

  return false;
}