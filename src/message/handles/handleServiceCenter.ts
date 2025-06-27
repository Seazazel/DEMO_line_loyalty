import { Client, TextMessage } from '@line/bot-sdk';
import { getLocationRequestFlex } from '../functions/flexMessage';
import { BASE_URL } from 'config/baseUrl.config';


export async function handleServiceCenter(
  client: Client,
  replyToken: string,
  item: string
) {
  switch (item) {
    case 'ศูนย์บริการใกล้ฉัน':
    case 'ตรอ. ใกล้ฉัน': {
      const textMsg: TextMessage = {
        type: 'text',
        text: `คุณเลือกบริการ: ${item}`,
      };
      const flexMsg = getLocationRequestFlex();
      await client.replyMessage(replyToken, [textMsg, flexMsg]);
      return;
    }

    case 'โปรโมชั่นศูนย์บริการ': {
      await client.replyMessage(replyToken, [
        {
          type: 'image',
          originalContentUrl: `${BASE_URL}/assets/images/promotion1.jpg`,
          previewImageUrl: `${BASE_URL}/assets/images/promotion1.jpg`,
        },
      ]);
      return true;
    }

    default:
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถระบุคำสั่งได้ 😢',
      });
      return;
  }
}
