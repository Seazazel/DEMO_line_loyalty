import { Client } from '@line/bot-sdk';
import { replyText} from '../functions/replyFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { BASE_URL } from 'config/baseUrl.config';


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
    
case 'บริจาคเงินช่วยเหลือเด็กๆ': {
  await client.replyMessage(replyToken, [
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/donate2.png`,
      previewImageUrl: `${BASE_URL}/assets/images/donate2.png`,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/donate1.png`,
      previewImageUrl: `${BASE_URL}/assets/images/donate1.png`,
    },
  ]);
  return;
}

    case 'อื่นๆ': {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `ท่านสามารถขอรับบริการเพิ่มเติมจากเจ้าหน้าที่ผ่านเบอร์ติดต่อ xxx-xxxxxxxx`, 
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
