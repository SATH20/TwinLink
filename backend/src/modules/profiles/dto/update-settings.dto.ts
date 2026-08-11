import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PrivacySettingsDto {
  @ApiProperty({ enum: ['public', 'connections'], required: false })
  @IsIn(['public', 'connections'])
  @IsOptional()
  profileVisibility?: 'public' | 'connections';

  @ApiProperty({ required: false, description: 'Include my Twin in other users\' recommendations' })
  @IsBoolean()
  @IsOptional()
  includeInMatching?: boolean;
}

export class NotificationPreferencesDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  connectionRequests?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  connectionAccepted?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  newMessages?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  twinUpdates?: boolean;
}

/**
 * Body for PATCH /v1/profiles/me/settings — updates privacy and/or notification
 * preferences. Both sections are optional so each can be saved independently.
 */
export class UpdateSettingsDto {
  @ApiProperty({ type: PrivacySettingsDto, required: false })
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  @IsOptional()
  privacy?: PrivacySettingsDto;

  @ApiProperty({ type: NotificationPreferencesDto, required: false })
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  @IsOptional()
  notificationPreferences?: NotificationPreferencesDto;
}
