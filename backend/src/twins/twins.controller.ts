import { Controller, Get } from '@nestjs/common';
import { TwinsService } from './twins.service';

@Controller('twins')
export class TwinsController {
  constructor(private readonly twinsService: TwinsService) {}

  @Get()
  findAll() {
    return this.twinsService.findAll();
  }
}
