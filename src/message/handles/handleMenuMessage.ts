import { getButtonOptionsFlexContent } from "../functions/flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";
import { getLicensePlateList } from "../functions/getLicensePlateList";
import { Client } from "@line/bot-sdk";
import { lineConfig } from "config/Line.config";
import { getRestaurantCarouselFlexContent } from "../functions/flexMessage";


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
            const message = getRestaurantCarouselFlexContent('ข้อมูลผลิตภัณฑ์', [
                {
                    title: 'Greenwing',
                    imageUrl: `${BASE_URL}/assets/images/greenwing1.jpg`,
                    location: 'หมวดหมู่: greenwing',
                    url: 'https://www.greenwing.co.th/',
                },
                {
                    title: 'Bigwing',
                    imageUrl: `${BASE_URL}/assets/images/bigwing1.jpg`,
                    location: 'หมวดหมู่: bigwing',
                    url: 'https://www.thaihonda.co.th/hondabigbike/',
                },
                {
                    title: 'Cubhouse',
                    imageUrl: `${BASE_URL}/assets/images/cubhouse1.jpg`,
                    location: 'หมวดหมู่: cubhouse',
                    url: 'https://www.thaihonda.co.th/cubhouse/',
                },
            ]);
            await client.replyMessage(replyToken, message);
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
                    originalContentUrl: `${BASE_URL}/assets/images/membership1.png`,
                    previewImageUrl: `${BASE_URL}/assets/images/membership1.png`,
                },
                {
                    type: 'image',
                    originalContentUrl: `${BASE_URL}/assets/images/membership2.png`,
                    previewImageUrl: `${BASE_URL}/assets/images/membership2.png`,
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
