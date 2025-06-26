import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@line/bot-sdk';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import { handleAdminAccess } from './handlers/handleAdminAccess';
import { handleUserAccess } from './handlers/handleUserAccess';

dotenv.config();


@Injectable()
export class HotspotService {
  private readonly logger = new Logger(HotspotService.name);
  private readonly hotspotURL = process.env.HOTSPOT_API_BASE_URL!;
  private isAdminCache: Map<string, boolean | null> = new Map();

  constructor(private readonly httpService: HttpService) {}

  private getCacheKey(userId: string, destination: string): string {
    return `${userId}_${destination}`;
  }

  // for log cache
  private logCache() {
    this.logger.log('Current isAdminCache content:');
    for (const [key, value] of this.isAdminCache.entries()) {
      this.logger.log(`  ${key} => ${value}`);
    }
  }

  // handle wifi request (check admin then cache it)
  async handleWifiRequest( userId: string, destination: string, client: Client, replyToken: string ): Promise<void> {

    const cacheKey = this.getCacheKey(userId, destination);
    let isAdmin = this.isAdminCache.get(cacheKey) ?? null;

    if (isAdmin === null) {
      this.logger.log(`isAdmin not cached for ${cacheKey}, checking backend...`);

      try {
        const response = await firstValueFrom(
          this.httpService.post(`${this.hotspotURL}/hotspot/check-admin`,  {
            user: { 
              userId,
              destination, 
              isAdmin : null,
            },
          })
        );

        const isAdminResponse = response.data?.isAdmin;

        if (typeof isAdminResponse === 'boolean') {
          isAdmin = isAdminResponse;
        } else {
          this.logger.warn(`isAdmin missing or invalid in response for ${cacheKey}`);
          isAdmin = null;
        }

        //set cache until this server stop running
        this.isAdminCache.set(cacheKey, isAdmin);
      } catch (error: any) {
        //
        console.error(`Server is down ${cacheKey}: ${error.message}`);

        throw error;
      }
    } else {
      this.logger.log(`Using cached isAdmin=${isAdmin} for ${cacheKey}`);
    }


    //deciding what to do
    if (isAdmin === true) {
      console.log("แอดมินเข้ามา");
      this.logCache();

      await handleAdminAccess(client, replyToken);

    } else {
      console.log("ไม่ใช่แอดมิน");
      this.logCache();

      await handleUserAccess(client, replyToken, userId, destination);

    }
  }
}
