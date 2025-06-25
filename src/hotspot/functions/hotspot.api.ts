import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { convertDateTime } from './convertDateTime';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';

const now = new Date();
const formattedDate = convertDateTime(now);
const hotspotURL = hotspotAPIConfig.hotspotURL;

export async function resetWifi(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string)
    : Promise<void> {

    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}/hotspot/Admin`, {
                user: {
                    userId,
                    destination,
                    branchId
                },
                content: {
                    request: 'resetWifi'
                },
            })
        );

        const messageText = response.data?.Text;

        await client.replyMessage(replyToken, {
            type: 'text',
            text: messageText,
        });
    } catch (error: any) {
        console.error('❌ resetWifi error:', error.message || error);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: 'ไม่สามารถรีเซ็ตรหัสผ่านได้ในขณะนี้/ server does not send return text',
        });
    }
}

export async function usageLog(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string)
    : Promise<void> {

    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}/hotspot/Admin`, {
                user: {
                    userId,
                    destination,
                    branchId
                },
                content: {
                    request: 'usageLog'
                },
            })
        );

        const logs: string[] = response.data?.logs || [];

        const messageText = logs.length
            ? `📊 ประวัติการใช้งาน:\n\n ` + logs.map((log, i) => `${i + 1}. ${log}`).join('\n\n')
            : 'ไม่พบประวัติการใช้งาน';

        await client.replyMessage(replyToken, {
            type: 'text',
            text: messageText,
        });
    } catch (error) {
        console.error('❌ viewUsageLog error:', error.message);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: 'ไม่สามารถดึงข้อมูลประวัติการใช้งานได้ในขณะนี้',
        });
    }
}


export async function getWiFi(
    httpService: HttpService, userId: string, profileId: string, destination: string, branchId: string): Promise<{ username?: string; password?: string }> {
    const response = await firstValueFrom(
        httpService.post(`${hotspotURL}/hotspot/Request-wifi`, {
            user: {
                userId,
                profileId: 1,
                destination,
                branchId
            },
            content: {
                formattedDate
            },
        }),
    );
    console.error("NOT SPAMMED")
    return response.data || {};
}

export async function spamGetWiFi(
    httpService: HttpService, userId: string, profileId: string, destination: string, branchId: string,): Promise<boolean> {
    const response = await firstValueFrom(
        httpService.post(`${hotspotURL}/hotspot/Spam`, {
            user: {
                userId,
                profileId: 1,
                destination,
                branchId
            },
            content: {
                formattedDate
            },
        }),
    );
    console.error("SPAMMED")
    return response.data?.Text === 'Not Exceed Hour';
}
