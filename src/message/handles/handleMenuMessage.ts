import { getButtonOptionsFlexContent } from "../functions/flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";
import { getLicensePlateList } from "../functions/getLicensePlateList";
import { Client } from "@line/bot-sdk";
import { lineConfig } from "config/Line.config";

const client = new Client(lineConfig);


const servicesOptions = ['ศูนย์บริการใกล้ฉัน', 'ตรอ. ใกล้ฉัน', 'โปรโมชั่นศูนย์บริการ'];
const regandinsureOptions = ['เช็คข้อมูลทะเบียน', 'ต่อทะเบียน', 'ต่อพรบ.', 'ซื้อ/ต่อประกัน'];
const moreOptions = ['ช่องทางการติดต่อ', 'สมัครงาน', 'ขอรหัส wi-fi', 'บริจาคเงินช่วยเหลือเด็กๆ', 'อื่นๆ'];

export async function handleMenuMessage(
    message: string,
    replyToken: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>,
    replyText: (token: string, text: string) => Promise<void>,
): Promise<boolean> {
    switch (message) {
        case 'เช็คค่างวด/ปิดบัญชี': {
            const licensePlate = await getLicensePlateList();
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                licensePlate.map((plate) => ({
                    label: plate,
                    postbackData: `action=checkInstallment&plate=${encodeURIComponent(plate)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'ข้อมูลผลิตภัณฑ์': {
            await replyText(replyToken, 'https://three-section-layout101-gsi4.vercel.app/?fbclid=IwY2xjawLK9E5leHRuA2FlbQIxMABicmlkETFvU1VIeFd0Y05ta3hKNER6AR51TZ31GZGTO4Ilz2SxGRhqi_NSgbXQPouvOocsDk7kOPv39mcHVG9-elaXLA_aem_2AEDZp97RbJ5w4Pq8wGHDQ');
            return true;
        }

        case 'ศูนย์บริการ/ตรอ.': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                servicesOptions.map((label) => ({
                    label,
                    postbackData: `action=serviceCenter&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'งานทะเบียน/ประกัน/พรบ.': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                regandinsureOptions.map((label) => ({
                    label,
                    postbackData: `action=insurance&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'สิทธิพิเศษ/สมาชิก': {
            await client.replyMessage(replyToken, [
                {
                    type: 'image',
                    originalContentUrl: `${BASE_URL}/assets/images/membership.png`,
                    previewImageUrl: `${BASE_URL}/assets/images/membership.png`,
                },
            ]);
            return true;
        }

        case 'งานบริการอื่นๆ/ติดต่อสอบถาม': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                moreOptions.map((label) => ({
                    label,
                    postbackData: `action=other&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        default:
            return false;
    }
}
