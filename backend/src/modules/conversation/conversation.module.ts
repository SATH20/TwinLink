import { Module, forwardRef } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './conversation.repository';
import { ConversationController } from './conversation.controller';
import { TwinsModule } from '../twins/twins.module';
import { AiModule } from '../ai/ai.module';
import { CompatibilityModule } from '../compatibility/compatibility.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { FirebaseModule } from '../../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    TwinsModule,
    AiModule,
    forwardRef(() => CompatibilityModule),
    ProfilesModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationService],
})
export class ConversationModule {}
