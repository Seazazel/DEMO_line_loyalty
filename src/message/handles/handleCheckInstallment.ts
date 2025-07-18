import { Client } from '@line/bot-sdk';
import { BASE_URL } from 'config/baseUrl.config';

export async function handleCheckInstallment(
  client: Client,
  replyToken: string,
  params: Record<string, string>
) {
  const plate = params['plate'] || 'ไม่ทราบทะเบียน';
  const mockResponse = `ข้อมูลค่างวดของทะเบียน ${decodeURIComponent(plate)} คือ 5,400 บาท ค้าง 3 งวด ✅`;

  await client.replyMessage(replyToken, [
  {
    type: 'text',
    text: mockResponse,
  },
  {
    type: 'image',
    originalContentUrl: `${BASE_URL}/assets/images/installment1.png`,
    previewImageUrl: `${BASE_URL}/assets/images/installment1.png`,
  },
  {
    type: 'image',
    originalContentUrl: `${BASE_URL}/assets/images/installment2.png`,
    previewImageUrl: `${BASE_URL}/assets/images/installment2.png`,
  },
  {
    type: 'image',
    originalContentUrl: `${BASE_URL}/assets/images/installment3.png`,
    previewImageUrl: `${BASE_URL}/assets/images/installment3.png`,
  },
]);

}
