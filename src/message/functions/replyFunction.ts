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

export async function replyFlex(
    client: Client,
    replyToken: string,
    flex: FlexMessage
): Promise<void> {
    await client.replyMessage(replyToken, [flex]);
}
