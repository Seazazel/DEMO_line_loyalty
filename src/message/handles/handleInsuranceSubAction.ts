import { Client } from '@line/bot-sdk';
import { replyText, replyFlex } from '../functions/replyFunction';
import { getLicensePlateList } from '../functions/getLicensePlateList';
import { getButtonOptionsFlexContent } from '../functions/flexMessage';
import { BASE_URL } from 'config/baseUrl.config';



export async function handleCheckLicenseNum(
  client: Client,
  replyToken: string,
  params: Record<string, string>
): Promise<void> {
  const plate = decodeURIComponent(params['plate'] || 'ไม่ทราบทะเบียน');
  const responseText = `ข้อมูลของทะเบียน ${plate}\n\nพรบ.ของท่านจะหมดอายุในวันที่ 24 มกราคม พ.ศ.2566 `;

  await client.replyMessage(replyToken, [
    {
      type: 'text',
      text: responseText,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/PRB2.jpg`,
      previewImageUrl: `${BASE_URL}/assets/images/PRB2.jpg`,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/PRB.jpg`,
      previewImageUrl: `${BASE_URL}/assets/images/PRB.jpg`,
    },
  ]);

  await replyText(client, replyToken, responseText);
}


export async function handleRenewLicense(
  client: Client,
  replyToken: string,
  params: Record<string, string>
): Promise<void> {

  const plate = decodeURIComponent(params['plate'] || 'ไม่ทราบทะเบียน');
  await client.replyMessage(replyToken, {
    type: 'text',
    text: `ส่งคำขอต่อทะเบียน ${plate} เรียบร้อยแล้ว\n\nเจ้าหน้าที่จะติดต่อท่านให้เร็วที่สุด ✅`,
  });
}

export async function handleRenewRegistration(
  client: Client,
  replyToken: string,
  params: Record<string, string>
): Promise<void> {

  const plate = decodeURIComponent(params['plate'] || 'ไม่ทราบทะเบียน');
  await client.replyMessage(replyToken, {
    type: 'text',
    text: `ส่งคำขอต่อพรบ.ของทะเบียน ${plate} เรียบร้อยแล้ว\n\nเจ้าหน้าที่จะติดต่อท่านให้เร็วที่สุด ✅`,
  });
}

export async function handleRenewOrBuyInsurance(
  client: Client,
  replyToken: string,
  item: string,
  params: Record<string, string>
): Promise<void> {
  switch (item) {
    case 'ซื้อประกัน': {
      await client.replyMessage(replyToken, [
        {
          type: 'image',
          originalContentUrl: `${BASE_URL}/assets/images/promotion2.jpg`,
          previewImageUrl: `${BASE_URL}/assets/images/promotion2.jpg`,
        },
      ]);
      return;
    }

    case 'ต่อประกัน': {
      const plate = decodeURIComponent(params['plate'] || '');

      // ✅ Step 1: No plate yet → show options to choose
      if (!plate) {
        const plates = await getLicensePlateList(); // e.g. ['1กก1234', '2ขข5678']

        const flex = getButtonOptionsFlexContent(
          'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
          plates.map((plate) => ({
            label: plate,
            postbackData: `action=renewInsurance&plate=${encodeURIComponent(plate)}`,
          }))
        );

        await replyFlex(client, replyToken, flex);
        return;
      }

      // ✅ Step 2: Plate is provided → confirm submission
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `ส่งคำขอต่อประกันของทะเบียน ${plate} เรียบร้อยแล้ว\n\nเจ้าหน้าที่จะติดต่อท่านให้เร็วที่สุด ✅`,
      });
      return;
    }


    default:
      await replyText(client, replyToken, 'คำสั่งไม่ถูกต้อง');
      break;
  }
}

export async function handleRenewInsurance(
  client: Client,
  replyToken: string,
  params: Record<string, string>
): Promise<void> {

  const plate = decodeURIComponent(params['plate'] || 'ไม่ทราบทะเบียน');
  await client.replyMessage(replyToken, {
    type: 'text',
    text: `ส่งคำขอต่อประกันของทะเบียน ${plate} เรียบร้อยแล้ว\n\nเจ้าหน้าที่จะติดต่อท่านให้เร็วที่สุด ✅`,
  });
}