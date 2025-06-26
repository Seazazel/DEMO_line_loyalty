import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HotspotModule, HttpModule], 
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
