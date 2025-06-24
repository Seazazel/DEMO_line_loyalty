export type AdminSessionStep = 'awaitingBranchId';

export interface AdminSession {
  action: 'usageLog' | 'resetWifi';
  step: AdminSessionStep;
}
export interface UserSession {
  action: 'requestWifi' | null;
  step: 'awaitingBranchId' | null;
  profileId?: string;
};

const adminSessionMap = new Map<string, AdminSession>();
const userSessionMap = new Map<string, UserSession>();


//ADMIN SESSION
export function setAdminSession(userId: string, session: AdminSession) {
  adminSessionMap.set(userId, session);
}

export function getAdminSession(userId: string): AdminSession | undefined {
  return adminSessionMap.get(userId);
}

export function clearAdminSession(userId: string) {
  adminSessionMap.delete(userId);
}


//USER SESSION
export function setUserSession(userId: string, session: UserSession) {
  userSessionMap.set(userId, session);
}

export function getUserSession(userId: string): UserSession | null {
  return userSessionMap.get(userId) || null;
}

export function clearUserSession(userId: string) {
  userSessionMap.delete(userId);
}

////////////////////// CACHE /////////////////////////////////

type CachedUserPass = {
  username: string;
  password: string;
  cachedAt: Date;
};

const userPassCache = new Map<string, CachedUserPass>();

export function setUserPassCache(key: string, data: CachedUserPass) {
  userPassCache.set(key, data);
}

export function getUserPassCache(key: string): CachedUserPass | null {
  return userPassCache.get(key) || null;
}

export function clearUserPassCache(key: string) {
  userPassCache.delete(key);
}

export async function handleUserAccess(){

return;
}
