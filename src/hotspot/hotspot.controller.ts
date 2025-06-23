import { Controller, Post, Body } from '@nestjs/common';
import { HotspotService } from './hotspot.service';


@Controller('message')
export class HotspotController {
  constructor(private readonly hotspotService: HotspotService) {}

  
  }
