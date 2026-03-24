import { Module } from '@nestjs/common';
import { TwinsController } from './twins.controller';
import { TwinsService } from './twins.service';

@Module({
  controllers: [TwinsController],
  providers: [TwinsService]
})
export class TwinsModule {}
