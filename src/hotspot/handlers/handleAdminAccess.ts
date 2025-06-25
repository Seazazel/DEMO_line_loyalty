import { Client } from '@line/bot-sdk';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';
import { getAdminSession, clearAdminSession } from 'src/hotspot/session/userSession.store';
import { getButtonOptionsFlexContent } from 'src/message/functions/flexMessage';
import { resetWifi, usageLog } from '../functions/hotspot.api';

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


