import { Client } from '@line/bot-sdk';
import { replyText } from '../functions/replyFunction';

export async function handleOther(
  client: Client,
  replyToken: string,
  item: string
): Promise<void> {
  switch (item) {
    case 'ช่องทางการติดต่อ': {
      await replyText(client, replyToken, 'ช่องทางการติดต่อ: https://www.greenwing.co.th/greenwingrn');
      return;
    }

    case 'สมัครงาน': {
      await replyText(client, replyToken, 'คลิกดูงานที่นี่: https://www.greenwing.co.th/career');
      return;
    }

    case 'ขอรหัส wi-fi':
    case 'อื่นๆ': {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `คุณเลือกบริการ: ${item}`,
      });
      return;
    }

    default: {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถระบุคำสั่งได้ 😢',
      });
      return;
    }
  }
}
