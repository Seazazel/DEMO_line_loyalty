import { Client } from '@line/bot-sdk';
import { replyText } from '../functions/replyFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';


export async function handleOther(
  client: Client,
  replyToken: string,
  item: string,
  message: string,
  userId: string,
  destination: string,
  hotspotService: HotspotService 
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

    case 'ขอรหัส wi-fi':{
        await hotspotService.handleWifiRequest(userId, destination, client, replyToken);
        return;
    }
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
