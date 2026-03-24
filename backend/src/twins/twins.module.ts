import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwinsController } from './twins.controller';
import { TwinsService } from './twins.service';

@Module({
  imports: [HttpModule],
  controllers: [TwinsController],
  providers: [TwinsService]
})
export class TwinsModule {}
