import { Injectable } from '@nestjs/common';
import { Client, MessageEvent, TextMessage, WebhookEvent, LocationMessage, PostbackEvent } from '@line/bot-sdk';
import { lineConfig } from 'config/Line.config';
import { replyFlex, replyText, replyImage } from './functions/replyFunction';
import { handlePostbackMessage } from './handles/handlePostbackMessage';
import { handleMenuMessage } from './handles/handleMenuMessage';
import { findNearbyServiceCenters, buildNearbyLocationFlex } from './functions/locationFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';

@Injectable()
export class MessageService {
    private client: Client;

    constructor(
        private readonly hotspotService: HotspotService // ✅ Injected via Nest
    ) {
        this.client = new Client(lineConfig);
    }
    async webhookHandler(reqBody: any) {
        const { destination, events } = reqBody;

        for (const event of events) {
            await this.handleEvent(event, destination);
        }
    }

    // Update handleEvent signature to accept destination:
    async handleEvent(event: WebhookEvent, destination: string): Promise<void> {
        try {
            if (event.type === 'message') {
                if (event.message.type === 'text') {
                    await this.handleMessageEvent(event, destination);
                } else if (event.message.type === 'location') {
                    await this.handleLocationEvent(event);
                }
            } else if (event.type === 'postback') {
                await this.handlePostbackEvent(this.client, event, destination);
            }

            else {
                console.log('Unhandled event type:', event.type);
            }
        } catch (error) {
            console.error('Error handling event:', error);
        }
    }

    async handleMessageEvent(event: MessageEvent, destination: string): Promise<void> {
        const userId = event.source.userId;
        if (!userId) {
            console.error('User ID is missing!');
            return;
        }

        const message = (event.message as TextMessage).text.trim();

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


    //handle postback
    async handlePostbackEvent(
        client: Client,
        event: PostbackEvent,
  destination: string 
    ): Promise<void> {
        const data = event.postback.data;
        const replyToken = event.replyToken;
        const userId = event.source.userId;

        if (!data|| !userId) {
            await replyText(client, replyToken, 'ไม่สามารถประมวลผลข้อมูลได้');
            return;
        }

        const params = Object.fromEntries(new URLSearchParams(data));
        const action = params['action'];
        const item = decodeURIComponent(params['item'] || '');

          await handlePostbackMessage(client, replyToken, action, item, params, this.hotspotService, userId, destination );
    }


    //handle location event
    async handleLocationEvent(event: MessageEvent): Promise<void> {
        console.log('📍 handleLocationEvent triggered');

        const userId = event.source.userId;
        const replyToken = event.replyToken;

        if (!userId) {
            console.error('Missing userId');
            return;
        }

        const message = event.message as LocationMessage;
        const { latitude, longitude, address } = message;

        console.log(`User sent location: ${latitude}, ${longitude}, ${address}`);

        const nearbyCenters = await findNearbyServiceCenters(latitude, longitude);

        if (nearbyCenters.length === 0) {
            await replyText(this.client, replyToken, 'ไม่พบศูนย์บริการใกล้เคียง 😥');
            return;
        }

        const flex = buildNearbyLocationFlex(nearbyCenters);
        await replyFlex(this.client, replyToken, flex);
    }

}
