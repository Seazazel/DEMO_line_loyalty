import { Client } from '@line/bot-sdk';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';
import { getAdminSession, clearAdminSession } from 'src/hotspot/session/userSession.store';
import { getButtonOptionsFlexContent } from 'src/message/functions/flexMessage';

interface AdminPayload {
    userId: string;
    destination: string;
    isAdmin: boolean | null;
}

// Step 1: Send admin options
export async function handleAdminAccess(client: Client, replyToken: string, payload: AdminPayload, logger: Logger) {

    logger.log('📡 Admin access granted, sending options...');

    const flex = getButtonOptionsFlexContent(
        'Admin Wi-Fi Acccess',
        [
            {
                label: 'ดูประวัติการใช้งาน',
                postbackData: 'action=usageLog',
            },
            {
                label: 'รีเซ็ตรหัส Wi-Fi',
                postbackData: 'action=resetWifi',
            },
        ]
    );

    await client.replyMessage(replyToken, flex);
}

export async function handleAdminBranchInput(client: Client, replyToken: string, userId: string, destination: string, message: string, httpService: HttpService,) {
    const session = getAdminSession(userId);
    if (!session || session.step !== 'awaitingBranchId') {
        return false; // Not handled here
    }

    clearAdminSession(userId);
    const branchId = message.trim();

    if (session.action === 'usageLog') {
        await usageLog(client, replyToken, httpService, hotspotAPIConfig.hotspotURL, userId, destination, branchId);
    } else if (session.action === 'resetWifi') {
        await resetWifi(client, replyToken, httpService, hotspotAPIConfig.hotspotURL, userId, destination, branchId);
    }

    return true; // Handled
}


export async function usageLog(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string)
    : Promise<void> {

    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}/viewLog`, {
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
            ? `📊 ประวัติการใช้งาน:\n- ` + logs.join('\n- ')
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


export async function resetWifi(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string)
    : Promise<void> {

    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}/resetWifi`, {
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

        const messageText = response.data?.Text || 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว';

        await client.replyMessage(replyToken, {
            type: 'text',
            text: messageText,
        });
    } catch (error: any) {
        console.error('❌ resetWifi error:', error.message || error);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: 'ไม่สามารถรีเซ็ตรหัสผ่านได้ในขณะนี้',
        });
    }
}

