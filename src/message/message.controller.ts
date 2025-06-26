import { Controller, Get, Post, Body, HttpCode, Req, Res, HttpStatus, OnModuleInit } from "@nestjs/common";
import { Request, Response } from "express";
import { MessageService } from './message.service';
import { lineConfig } from "config/Line.config";
import { WebhookRequestBody } from '@line/bot-sdk';
import * as line from '@line/bot-sdk';


@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService) { }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Body() body: WebhookRequestBody,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    const signature = req.headers['x-line-signature'] as string;

    // // Clone body to avoid mutating original object
const bodyWithFormattedTimestamps = {
  ...body,
  events: body.events?.map(event => {
    const date = new Date(event.timestamp);

    // Convert to Thai timezone (Asia/Bangkok)
    const thaiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

    // Format: YYYY-MM-DD HH:mm:ss
    const year = thaiDate.getFullYear();
    const month = String(thaiDate.getMonth() + 1).padStart(2, '0');
    const day = String(thaiDate.getDate()).padStart(2, '0');
    const hours = String(thaiDate.getHours()).padStart(2, '0');
    const minutes = String(thaiDate.getMinutes()).padStart(2, '0');
    const seconds = String(thaiDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return {
      ...event,
      formattedDate,
    };
  }) || [],
};

    console.log('📦 Body with formatted timestamps:', JSON.stringify(bodyWithFormattedTimestamps, null, 2));
    //console.log('📦 Body:', JSON.stringify(body, null, 2));
    //console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
    if (!lineConfig.channelSecret) {
      console.error("LINE Channel Secret is not configured in line.config.ts.");
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server configuration error');
    }

    const rawBodyBuffer = (req as any).rawBody;
    const bodyToVerify = rawBodyBuffer ? rawBodyBuffer.toString('utf8') : JSON.stringify(body);

    const isValid = line.validateSignature(
      bodyToVerify,
      lineConfig.channelSecret,
      signature,
    );

    if (!isValid) {
      console.warn('Invalid LINE signature. Request potentially not from LINE.');
      return res.status(HttpStatus.FORBIDDEN).send('Invalid signature');
    }

    try {
      if (body.events && body.events.length > 0) {
        for (const event of body.events) {
          await this.messageService.handleEvent(event, body.destination);
        }
      }
      return res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return res.status(HttpStatus.OK).send('Error processing event');
    }
  }

}