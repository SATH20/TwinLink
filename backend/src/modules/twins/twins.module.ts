import { Module, forwardRef } from '@nestjs/common';
import { TwinsService } from './twins.service';
import { TwinsController } from './twins.controller';
import { TwinsRepository } from './twins.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    forwardRef(() => ProfilesModule),
    forwardRef(() => AiModule),
  ],
  controllers: [TwinsController],
  providers: [TwinsService, TwinsRepository],
  exports: [TwinsService, TwinsRepository],
})
export class TwinsModule {}
