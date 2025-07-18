import { FlexMessage } from '@line/bot-sdk';

export interface ServiceCenter {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyServiceCenters(userLat: number, userLng: number): Promise<ServiceCenter[]> {
  const mockCenters: ServiceCenter[] = [
    //แม่สาย
    { name: 'ฮอนด้ากรีนวิง สาขาห้วยไคร้', address: 'ตำบล ห้วยไคร้ อำเภอแม่สาย เชียงราย 57220', lat: 20.270879668742996, lng: 99.8607168846579 },
    { name: 'ฮอนด้ากรีนวิง สาขาป่าเหมือด', address: '333, 3 ตำบล เวียงพางคำ อำเภอแม่สาย เชียงราย', lat: 20.41334535371456, lng: 99.88586860184868 },
    { name: 'ฮอนด้ากรีนวิง สาขาป่าเหมือด', address: '6666 ถ. พหลโยธิน ตำบล เวียงพางคำ อำเภอแม่สาย เชียงราย 57130', lat: 20.431433444626386, lng: 99.8848601760625 },
    //เทิง
    { name: 'ฮอนด้ากรีนวิง สาขาเทิง1', address: 'เวียง 26/4-6 อำเภอ เทิง เชียงราย 57160', lat: 19.714888643993493, lng: 100.19208517467548 },
    { name: 'ฮอนด้ากรีนวิง สาขาเทิง2', address: '147 3 ตำบล เวียง อำเภอ เทิง เชียงราย 57160', lat: 19.687670880836485, lng: 100.19585910184868 },
    { name: 'ฮอนด้ากรีนวิง สาขาบ้านปล้อง', address: 'ตำบล ปล้อง อำเภอ เทิง เชียงราย 57230', lat: 19.65703354058113, lng: 100.09112281959216 },
    //แม่จัน
    { name: 'ฮอนด้ากรีนวิง สาขาจันจว้า', address: 'ตำบล จันจว้าใต้ อำเภอแม่จัน เชียงราย 57270', lat: 20.22468705522747, lng: 99.94770432752084 },
    { name: 'กรีนวิง สาขาแม่คำ มอเตอร์ไซค์ ฮอนด้า', address: 'หมู่ที่2 238 ตำบล แม่คำ อำเภอแม่จัน เชียงราย 57240', lat: 20.228147836951923, lng: 99.85599847301509 },
    { name: 'ฮอนด้ากรีนวิง สาขาแม่จัน1', address: '182 หมู่7 ตำบล แม่จัน อำเภอแม่จัน เชียงราย 57110', lat: 20.154738834247343, lng: 99.8606826322449 },
    { name: 'ฮอนด้ากรีนวิง สาขาแม่จัน2', address: '448/4 Moo 3, Tambon Mae Chan, Amphur ตำบล แม่จัน อำเภอแม่จัน เชียงราย 57110', lat: 20.14994280978411, lng: 99.85451272328304 },
    //เมือง
    { name: 'ฮอนด้ากรีนวิง สาขาประตูสลี (สำนักงานใหญ่)', address: '545/1 ถนน รัตนาเขต ตำบลเวียง อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.907726652404076, lng: 99.8329087000712 },
    { name: 'ฮอนด้ากรีนวิง สาขาบ้านดู่', address: 'ตำบล บ้านดู่ อำเภอเมืองเชียงราย เชียงราย 57100', lat: 19.964619219110322, lng: 99.85562715092432},
    { name: 'ฮอนด้ากรีนวิง สาขาห้าแยก', address: '434 บ้านริมดอย ซอย 1-2 ตำบล รอบเวียง อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.914545552357357, lng: 99.84514370926372},
    { name: 'ฮอนด้ากรีนวิง สาขาเจ็ดยอด', address: '902 2 ถนนพหลโยธิน ตำบลเวียง อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.901862505739267, lng:99.83286087975985},
    { name: 'ฮอนด้ากรีนวิง สาขาเด่นห้า', address: '202 อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.902560850232202, lng:99.81442274882421},
    { name: 'ฮอนด้ากรีนวิง สาขาห้วยสัก', address: 'ตำบล ห้วยสัก อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.778100733829405, lng:99.91022179448966},
    { name: 'ฮอนด้ากรีนวิง สาขาแม่ข้าวต้ม', address: '333 ตำบล แม่ข้าวต้ม อำเภอเมืองเชียงราย เชียงราย 57100', lat: 20.00765086715047,lng:99.90704522208878},
    { name: 'ฮอนด้ากรีนวิง สาขาน้ำลัด', address: '304 หมู่ที่ 3 ซอย แม่ฟ้าหลวง ตำบลริมกก อำเภอเมืองเชียงราย เชียงราย 57100', lat: 19.9286373622586, lng:99.81578621288119},
    { name: 'ฮอนด้ากรีนวิง สาขาศรีทรายมูล', address: '273 6 ตำบล รอบเวียง อำเภอเมืองเชียงราย เชียงราย 57000', lat: 19.89533180623113, lng:99.85302800674671},
    //เวียงป่าเป้า
    { name: 'ฮอนด้ากรีนวิง สาขาแม่ขะจาน1', address: '275 หมู่10 ตำบล แม่เจดีย์ อำเภอเวียงป่าเป้า เชียงราย 57260', lat: 19.21122557161968, lng: 99.5179112},
    { name: 'ฮอนด้ากรีนวิง สาขาแม่ขะจาน2', address: '378/4 5 ตำบล แม่เจดีย์ อำเภอเวียงป่าเป้า เชียงราย 57260', lat: 19.19593065302485, lng: 99.51591438664838 },
    { name: 'ฮอนด้ากรีนวิง สาขาป่างิ้ว', address: '180 ตำบล ป่างิ้ว อำเภอเวียงป่าเป้า เชียงราย 57170', lat: 19.29469665638709, lng: 99.51184662358213 },
    { name: 'ฮอนด้ากรีนวิง สาขาเวียงป่าเป้า', address: '37 ม.10 ตำบล เวียง อำเภอเวียงป่าเป้า เชียงราย 57170', lat: 19.367098258368177, lng: 99.50369954068731 },
    { name: 'ฮอนด้ากรีนวิง สาขาป่าเหมือด', address: '6666 ถ. พหลโยธิน ตำบล เวียงพางคำ อำเภอแม่สาย เชียงราย 57130', lat: 20.431433444626386, lng: 99.8848601760625 },
    //เวียงชัย
    { name: 'ฮอนด้ากรีนวิง สาขาเวียงชัย', address: '440 ตำบล เวียงชัย อำเภอ เวียงชัย เชียงราย 57210', lat: 19.88167379804174,  lng:99.930040436783},
    { name: 'ฮอนด้ากรีนวิง สาขาบ้านดอน', address: 'ตำบล ดอนศิลา อำเภอ เวียงชัย เชียงราย 57210', lat: 19.825515323597575,  lng:100.02304822144093},
    //เชียงแสน
    { name: 'กรีนวิง สาขาเชียงแสน1', address: '73FM+PVJ ตำบล เวียง อำเภอ เชียงแสน เชียงราย 57150', lat: 20.274376200094444, lng: 100.08463507474843 },
    { name: 'ฮอนด้ากรีนวิง สาขาเชียงแสน2', address: '7771 1 ตำบล เวียง อำเภอ เชียงแสน เชียงราย 57150', lat: 20.27080897868618, lng: 100.08464724353145 },
    //เชียงของ
    { name: 'ฮอนด้ากรีนวิง สาขาบุญเรือง', address: '109 ม.1 ต.บุญเรือง ต.บุญเรือง, อำเภอ เชียงของ เชียงราย 57140', lat: 20.00097732451754, lng: 100.3436077380905 },
    { name: 'ฮอนด้ากรีนวิง สาขาเชียงของ1', address: '293 หมู่ที่12 ตำบล เวียง อำเภอ เชียงของ เชียงราย 57140', lat: 20.26203568815531, lng: 100.40688330370186 },
    { name: 'ฮอนด้ากรีนวิง สาขาเชียงของ2', address: '212 หมู่ 10 เวียง อำเภอ เชียงของ เชียงราย 57140', lat: 20.245829295838487, lng: 100.41122672143212 },
    //พาน
    { name: 'ฮอนด้ากรีนวิง สาขาพาน1', address: '1188/1 3 ตำบล เมืองพาน อำเภอ พาน เชียงราย 57120', lat: 19.54855590419263, lng: 99.74124255306721},
    { name: 'ฮอนด้ากรีนวิง สาขาพาน2', address: '2593-2598 ตำบล เมืองพาน อำเภอ พาน เชียงราย 57120', lat: 19.55214570354707, lng: 99.74078249022294 },
    { name: 'ฮอนด้ากรีนวิง สาขาปูแกง', address: 'FQ74+22X 40 หมู่9 ตำบล แม่เย็น อำเภอ พาน เชียงราย 57280', lat: 19.462260647303818, lng: 99.75515217106299 },
    { name: 'ฮอนด้ากรีนวิง สาขาแม่อ้อ', address: '139 หมู่19 ตำบล แม่อ้อ อำเภอ พาน เชียงราย 57120', lat: 19.66075832570686, lng: 99.85095777606199 },
    //ขุนตาล
    { name: 'ฮอนด้ากรีนวิง สาขาบ้านต้า', address: 'ต้า 325 ม.3 อำเภอ ขุนตาล เชียงราย 57340', lat: 19.81070620408844,  lng:100.23949440674673},
    //เวียงเียงรุ้ง
    { name: 'ฮอนด้ากรีนวิง สาขาเชียงรุ้ง', address: '40 หมู่6 ตำบล ทุ่งก่อ อำเภอ เวียงเชียงรุ้ง เชียงราย 57210', lat: 20.008472309457925,  lng:100.04033397691694},
    //แม่ลาว
    { name: 'ฮอนด้ากรีนวิง สาขาแม่ลาว', address: '245 หมู่10 ตำบล ป่าก่อดำ อำเภอแม่ลาว เชียงราย 57250', lat: 19.773699474180727,  lng:99.73860953618262},
    //แม่สรวย
    { name: 'ฮอนด้ากรีนวิง สาขาแม่สรวย', address: '241 หมู่ 5, ตำบลแม่สรวย อำเภอแม่สรวย เชียงราย, 57130 อำเภอแม่สรวย เชียงราย 57180', lat: 19.655452592606487, lng: 99.54033541654223 },
    { name: 'ฮอนด้า กรีนวิง สาขาท่าก๊อ', address: '249 หมู่4 ตำบล ท่าก๊อ อำเภอแม่สรวย เชียงราย 57180', lat: 19.49333744530269, lng: 99.47521446564848 },
    { name: 'กรีนวิง สาขาห้วยส้ม', address: 'หมู่ที่ 3 289 ตำบล เจดีย์หลวง อำเภอแม่สรวย เชียงราย 57180', lat: 19.58713290191078, lng: 99.49504684544556 },
    //ป่าแดด
    { name: 'ฮอนด้ากรีนวิง สาขาป่าแดด', address: '203 อำเภอ ป่าแดด เชียงราย 57190', lat: 19.500763468088476, lng: 99.99264492698491 },
    //เวียงแก่น
    { name: 'ฮอนด้ากรีนวิง สาขาเวียงแก่น', address: '2หล่าวงาว, 264 หมู่ 1, อำเภอ เวียงแก่น เชียงราย 57310', lat: 20.104664264337227, lng: 100.50874807605945 },
    //พญาเม็งราย
    { name: 'ฮอนด้ากรีนวิง สาขาพญาเม็งราย', address: 'ตำบล เม็งราย อำเภอ พญาเม็งราย เชียงราย 57290', lat: 19.84890176595449, lng: 100.15481384374803 },
  ];

  return mockCenters
    .map(center => ({
      ...center,
      distance: haversineDistance(userLat, userLng, center.lat, center.lng),
    }))
    .filter(center => center.distance <= 10) // ✅ only within 10 km
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // return top 3 nearby (optional)
}

export function buildNearbyLocationFlex(centers: ServiceCenter[]): FlexMessage {
  return {
    type: 'flex',
    altText: 'ศูนย์บริการใกล้คุณ',
    contents: {
      type: 'carousel',
      contents: centers.map(center => ({
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: center.name,
              weight: 'bold',
              size: 'md',
              wrap: true
            },
            {
              type: 'text',
              text: center.address,
              size: 'sm',
              color: '#666666',
              wrap: true
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'link',
              action: {
                type: 'uri',
                label: 'ดูแผนที่',
                uri: `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`
              }
            }
          ]
        }
      }))
    }
  };
}

