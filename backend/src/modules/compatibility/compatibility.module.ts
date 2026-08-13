import { Module, forwardRef } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';
import { CompatibilityController } from './compatibility.controller';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { MatchingModule } from '../matching/matching.module';
import { TwinsModule } from '../twins/twins.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AiModule,
    forwardRef(() => ConversationModule),
    ProfilesModule,
    forwardRef(() => MatchingModule),
    TwinsModule,
  ],
  controllers: [CompatibilityController],
  providers: [CompatibilityService],
  exports: [CompatibilityService],
})
export class CompatibilityModule {}
