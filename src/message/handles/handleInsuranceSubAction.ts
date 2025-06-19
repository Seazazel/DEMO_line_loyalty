import { Client } from '@line/bot-sdk';
import { replyText, replyImage, replyFlex } from '../functions/replyFunction';
import { getLicensePlateList } from '../functions/getLicensePlateList';
import { getButtonOptionsFlexContent } from '../functions/flexMessage';



export async function handleCheckLicenseNum(
  client: Client,
  replyToken: string,
  params: Record<string, string>
): Promise<void> {
  const plate = decodeURIComponent(params['plate'] || 'ไม่ทราบทะเบียน');
  const responseText = `ข้อมูลของทะเบียน ${plate} คือ: รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน ✅`;

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
    text: `ส่งคำขอต่อทะเบียน ${plate} เรียบร้อยแล้ว`,
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
    text: `ส่งคำขอต่อพรบ.ของทะเบียน ${plate} เรียบร้อยแล้ว`,
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
      await replyText(client, replyToken, 'สมมติว่านี่เป็นภาพโปรโมชั่น');
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
    text: `ส่งคำขอต่อประกันของทะเบียน ${plate} เรียบร้อยแล้ว ✅`,
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
    text: `ส่งคำขอต่อประกันของทะเบียน ${plate} เรียบร้อยแล้ว`,
  });
}