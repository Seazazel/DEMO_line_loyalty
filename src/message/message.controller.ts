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
    // const bodyWithFormattedTimestamps = {
    //   ...body,
    //   events: body.events?.map(event => ({
    //     ...event,
    //     formattedTimestamp: new Date(event.timestamp).toISOString(),
    //   })) || [],
    // };

    //console.log('📦 Body with formatted timestamps:', JSON.stringify(bodyWithFormattedTimestamps, null, 2));
    //console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(body, null, 2));
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