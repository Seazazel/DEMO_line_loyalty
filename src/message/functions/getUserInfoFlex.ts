// import { FlexButton, FlexBubble, FlexMessage } from '@line/bot-sdk';

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