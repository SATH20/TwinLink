import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('AI_SERVICE_TIMEOUT', 30000),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
