import type { FlexMessage, FlexBubble, FlexButton} from '@line/bot-sdk';
import { ServiceCenter } from '../types/message.interface';

type ButtonOption = {
  label: string;
  postbackData: string;
};

export function getButtonOptionsFlexContent(
  title: string,
  options: ButtonOption[]
): FlexMessage {
  const buttonComponents: FlexButton[] = options.map(({ label, postbackData }) => ({
    type: 'button',
    action: {
      type: 'postback',
      label,
      data: postbackData,
    },
    style: 'primary',
    color: '#00B900',
  }));

  const contents: FlexBubble = {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        {
          type: 'text',
          text: title,
          weight: 'bold',
          size: 'xl',
        },
        ...buttonComponents,
      ],
    },
  };

  return {
    type: 'flex',
    altText: title,
    contents,
  };
}

export function getLocationRequestFlex(): FlexMessage {
  return {
    type: 'flex',
    altText: 'โปรดแชร์ตำแหน่งของคุณ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '📍 กรุณาส่งตำแหน่งของคุณ',
            weight: 'bold',
            size: 'lg',
            wrap: true
          },
          {
            type: 'text',
            text: 'แตะปุ่มด้านล่างเพื่อเปิดแผนที่และแชร์ตำแหน่งของคุณกับเรา',
            size: 'sm',
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
            style: 'primary',
            color: '#00B900',
            action: {
              type: 'uri',
              label: 'ส่งตำแหน่ง',
              uri: 'line://nv/location'
            }
          }
        ]
      }
    }
  };
}

// export function getUserInfoFlex(user: { name: string; email: string }): Promise<FlexMessage> {
//     return {
//       type: 'flex',
//       altText: 'ข้อมูลผู้ใช้',
//       contents: {
//         type: 'bubble',
//         body: {
//           type: 'box',
//           layout: 'vertical',
//           contents: [
//             {
//               type: 'text',
//               text: `ชื่อ: ${user.name}`,
//               weight: 'bold',
//               size: 'md',
//             },
//             {
//               type: 'text',
//               text: `อีเมล: ${user.email}`,
//               size: 'sm',
//               color: '#666666',
//             },
//           ],
//         },
//       },
//     };
//   }