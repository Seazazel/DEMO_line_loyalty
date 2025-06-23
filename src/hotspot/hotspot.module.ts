import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HotspotService } from './hotspot.service';
import { HotspotController } from './hotspot.controller';

@Module({
  imports: [HttpModule],
  controllers: [HotspotController],
  providers: [HotspotService],
  exports: [HotspotService],
})
export class HotspotModule {}
