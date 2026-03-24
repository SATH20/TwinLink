import { Controller, Get, Post, Body } from '@nestjs/common';
import { TwinsService } from './twins.service';
import { CreateTwinDto } from './dto/create-twin.dto';

@Controller('twin')
export class TwinsController {
  constructor(private readonly twinsService: TwinsService) {}

  @Get()
  findAll() {
    return this.twinsService.findAll();
  }

  @Post('create')
  createTwin(@Body() createTwinDto: CreateTwinDto) {
    return this.twinsService.createTwin(createTwinDto);
  }
}
