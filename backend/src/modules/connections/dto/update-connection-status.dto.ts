import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConnectionStatus } from '../enums/connection-status.enum';

export class UpdateConnectionStatusDto {
  @ApiProperty({ enum: ConnectionStatus, description: 'New connection status' })
  @IsEnum(ConnectionStatus)
  status: ConnectionStatus;
}
