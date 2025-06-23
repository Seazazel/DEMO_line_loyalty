import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { HotspotModule } from 'src/hotspot/hotspot.module';


@Module({
  imports: [HotspotModule], 
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
