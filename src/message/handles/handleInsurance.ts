import { Client } from '@line/bot-sdk';
import { replyText, replyFlex } from '../functions/replyFunction';
import { getButtonOptionsFlexContent } from '../functions/flexMessage';
import { getLicensePlateList } from '../functions/getLicensePlateList';

const options = ['ซื้อประกัน', 'ต่อประกัน']

export async function handleInsurance(
    client: Client,
    replyToken: string,
    item: string
): Promise<void> {
    switch (item) {
        case 'เช็คข้อมูลทะเบียน': {
            const plates = await getLicensePlateList();

            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                plates.map((plate) => ({
                    label: plate,
                    postbackData: `action=checkLicenseNum&plate=${encodeURIComponent(plate)}`,
                }))
            );

            await replyFlex(client, replyToken, flex);
            return;
        }

        case 'ต่อทะเบียน': {
            const plates = await getLicensePlateList();

            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                plates.map((plate) => ({
                    label: plate,
                    postbackData: `action=renewLicense&plate=${encodeURIComponent(plate)}`,
                }))
            );

            await replyFlex(client, replyToken, flex);
            return;
        }

        case 'ต่อพรบ.': {
            const plates = await getLicensePlateList();

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
        case 'ซื้อ/ต่อประกัน': {

            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                options.map((label) => ({
                    label,
                    postbackData: `action=renewOrBuyInsurance&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(client, replyToken, flex);
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
