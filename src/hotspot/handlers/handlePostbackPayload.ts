import { Client } from '@line/bot-sdk';
import { setAdminSession, setUserSession } from 'src/hotspot/session/userSession.store';
import { replyText } from 'src/message/functions/replyFunction';

export async function handlePostbackPayload(client: Client, replyToken: string, userId: string, action: string, params: Record<string, string>) {

    switch (action) {
        case 'usageLog':
            setAdminSession(userId, {
                action: 'usageLog',
                step: 'awaitingBranchId',
            });

            await replyText(
                client,
                replyToken,
                'โปรดกรอกรหัสสาขาที่ต้องการ\n\n- ข้อมูลเฉพาะสาขาโปรดพิมพ์รหัสสาขา\n- ข้อมูลทุกสาขาโปรดพิมพ์ all'
            );
            return true; // Indicate that the action was handled here

        case 'resetWifi':
            setAdminSession(userId, {
                action: 'resetWifi',
                step: 'awaitingBranchId',
            });

            await replyText(
                client,
                replyToken,
                'โปรดกรอกรหัสสาขาที่ต้องการ\n\n- รีเซ็ตรหัสเฉพาะสาขาโปรดพิมพ์รหัสสาขา\n- รีเซ็ตรหัสทุกสาขาโปรดพิมพ์ all'
            );
            return true; // Indicate that the action was handled here

        default:
            return false; // Not handled here
    }
}
