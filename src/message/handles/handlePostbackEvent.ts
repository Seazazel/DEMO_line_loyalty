import { MessageEvent, PostbackEvent, TextMessage } from '@line/bot-sdk';
import { Client } from '@line/bot-sdk';
import { replyText } from '../functions/replyFunction';
import { BASE_URL } from 'config/baseUrl.config';
import { getLocationRequestFlex } from '../functions/flexMessage';

export async function handlePostbackEvent(
  client: Client,
  event: PostbackEvent
): Promise<void> {
  const data = event.postback.data;
  const replyToken = event.replyToken;

  if (!data) {
    await replyText(client, replyToken, 'ไม่สามารถประมวลผลข้อมูลได้');
    return;
  }
  const params = Object.fromEntries(new URLSearchParams(data));
  const action = params['action'];

  switch (action) {
    case 'checkInstallment': {
      const plate = params['plate'] || 'ไม่ทราบทะเบียน';
      const mockResponse = `ข้อมูลค่างวดของทะเบียน ${decodeURIComponent(plate)} คือ 5,400 บาท ค้าง 0 งวด ✅`;

      await client.replyMessage(replyToken, [
        { type: 'text', text: mockResponse },
        {
          type: 'image',
          originalContentUrl: `${BASE_URL}/assets/images/installment.png`,
          previewImageUrl: `${BASE_URL}/assets/images/installment.png`,
        },
      ]);
      return;
    }

    case 'serviceCenter': {
      const item = decodeURIComponent(params['item']);

      const textMsg: TextMessage = {
        type: 'text',
        text: `คุณเลือกบริการ: ${item}`,
      };

      const flexMsg = getLocationRequestFlex();

      await client.replyMessage(replyToken, [textMsg, flexMsg]);
      return;
    }

    case 'insurance': {
      await replyText(client, replyToken, `คุณเลือกบริการ: ${decodeURIComponent(params['item'])}`);
      return;
    }

    case 'other': {
      await replyText(client, replyToken, `คุณเลือก: ${decodeURIComponent(params['item'])}`);
      return;
    }

    default: {
      await replyText(client, replyToken, 'คำสั่งไม่ถูกต้อง');
      return;
    }
  }
}
