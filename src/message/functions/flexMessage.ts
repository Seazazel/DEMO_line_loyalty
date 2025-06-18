import type { FlexMessage, FlexBubble, FlexButton} from '@line/bot-sdk';

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
    color: '#00BFA5',
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
