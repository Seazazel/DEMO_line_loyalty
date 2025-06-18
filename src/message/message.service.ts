import { Injectable } from '@nestjs/common';
import { Client, MessageEvent, PostbackEvent, TextMessage, WebhookEvent, FlexButton, FlexBubble, FlexMessage } from '@line/bot-sdk';
import { lineConfig } from 'config/Line.config';
import { userSession } from './types/message.interface';
import { handleConversationStep } from './functions/handleConversationStep';
import { handleMenuMessage } from './functions/handleMenuMessage';
import { handlePostbackEvent } from './functions/handlePostback';
import { replyFlex, replyText, replyImage } from './functions/replyFunction';

@Injectable()
export class MessageService {
    private client: Client;
    private userSession: Record<string, userSession> = {};

    constructor() {
        this.client = new Client(lineConfig);
    }

    //handle event
    async handleEvent(event: WebhookEvent): Promise<void> {
        try {
            if (event.type === 'message' && event.message.type === 'text') {
                await this.handleMessageEvent(event);
            } else if (event.type === 'postback') {
                await handlePostbackEvent(this.client, event);

            } else {
                console.log('Unhandled event type:', event.type);
            }
        } catch (error) {
            console.error('Error handling event:', error);
        }
    }

    //handle message event
    async handleMessageEvent(event: MessageEvent): Promise<void> {
    const userId = event.source.userId;
    if (!userId) {
        console.error('User ID is missing!');
        return;
    }

    this.userSession[userId] ||= { userID: userId };
    const session = this.userSession[userId];
    const message = (event.message as TextMessage).text.trim();

    const conversationReplied = await handleConversationStep(session, event, message);
    if (conversationReplied) return;

    const menuReplied = await handleMenuMessage(
        message,
        event.replyToken,
        (token, flex) => replyFlex(this.client, token, flex),
        (token, text) => replyText(this.client, token, text),
        (token, image) => replyImage(this.client, token, image)
    );
    if (menuReplied) return;

    // Only reply if both did not reply
    await this.client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาเลือกคำสั่งในริชเมนู',
    });
}


}
