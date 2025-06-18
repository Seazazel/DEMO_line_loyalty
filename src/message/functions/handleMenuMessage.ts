import { getButtonOptionsFlexContent } from "./flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";

const licenseNum = ['ขง 666 เชียงราย', 'กก 6969 พะเยา', 'ลล 3335 เชียงราย']
const servicesOptions = ['ศูนย์บริการใกล้ฉัน', 'ตรอ. ใกล้ฉัน', 'โปรโมชั่นศูนย์บริการ'];
const regandinsureOptions = ['เช็คข้อมูลทะเบียน', 'ต่อทะเบียน', 'ต่อพรบ.', 'ซื้อ/ต่อประกัน'];
const moreOptions = ['ช่องทางการติดต่อ', 'สมัครงาน', 'อื่นๆ'];

export async function handleMenuMessage(
    message: string,
    replyToken: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>,
    replyText: (token: string, text: string) => Promise<void>,
    replyImage: (token: string, image: { originalContentUrl: string; previewImageUrl: string }) => Promise<void>
): Promise<boolean> {
    switch (message) {
        case 'เช็คค่างวด/ปิดบัญชี': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                licenseNum.map((plate) => ({
                    label: plate,
                    postbackData: `action=checkInstallment&plate=${encodeURIComponent(plate)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'ข้อมูลผลิตภัณฑ์': {
            await replyText(replyToken, 'คุณสามารถดูข้อมูลผลิตภัณฑ์ได้ที่นี่:\nhttps://fir-webloyalty.web.app/');
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
            await replyImage(replyToken, {
                originalContentUrl: `${BASE_URL}/assets/images/membership.png`,
                previewImageUrl: `${BASE_URL}/assets/images/membership.png`,
            });
            //console.log('Image URL:', `${BASE_URL}/assets/images/membership.png`);

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
