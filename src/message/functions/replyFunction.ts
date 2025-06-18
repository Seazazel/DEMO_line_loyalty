import { Client, FlexMessage } from '@line/bot-sdk';

export async function replyText(
    client: Client,
    replyToken: string,
    text: string
): Promise<void> {
    await client.replyMessage(replyToken, [
        {
            type: 'text',
            text,
        },
    ]);
}

export async function replyImage(
    client: Client,
    replyToken: string,
    image: {
        originalContentUrl: string;
        previewImageUrl: string;
    }
): Promise<void> {
    await client.replyMessage(replyToken, [
        {
            type: 'image',
            originalContentUrl: image.originalContentUrl,
            previewImageUrl: image.previewImageUrl,
        },
    ]);
}

export async function replyFlex(
    client: Client,
    replyToken: string,
    flex: FlexMessage
): Promise<void> {
    await client.replyMessage(replyToken, [flex]);
}
