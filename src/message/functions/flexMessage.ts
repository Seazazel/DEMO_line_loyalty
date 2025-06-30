import type { FlexMessage, FlexBubble, FlexButton} from '@line/bot-sdk';


type ButtonOption = {
  label: string;
  postbackData: string;
};

interface ProductCard {
  title: string;
  imageUrl: string;
  location: string;
  url: string; // New field for the link
}

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


export function getRestaurantCarouselFlexContent(
  altText: string,
  cards: ProductCard[]
): FlexMessage {
  const bubbles: FlexBubble[] = cards.map(({ title, imageUrl, location, url }) => ({
    type: 'bubble',
    hero: {
      type: 'image',
      url: imageUrl,
      size: 'full',
      aspectRatio: '1:1',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: title,
          weight: 'bold',
          size: 'md',
          wrap: true,
        },
        // Removed rating box here
        {
          type: 'text',
          text: location,
          size: 'sm',
          color: '#aaaaaa',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'เข้าสู่เว็บไซต์',
            uri: url,
          },
          style: 'link',
        },
      ],
    },
  }));

  return {
    type: 'flex',
    altText,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}
