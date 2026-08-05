import { Controller, Post, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TwinsService } from './twins.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTwinDto } from './dto/create-twin.dto';
import { UpdateTwinDto } from './dto/update-twin.dto';

@ApiTags('Digital Twins')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/twins')
export class TwinsController {
  constructor(private readonly twinsService: TwinsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new digital twin for the authenticated user' })
  @ApiBody({ type: CreateTwinDto })
  @ApiResponse({ status: 201, description: 'Digital twin created successfully' })
  @ApiResponse({ status: 400, description: 'Profile must be at least 60% complete' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 409, description: 'A digital twin already exists for this user' })
  async createTwin(@CurrentUser() user: any, @Body() createTwinDto: CreateTwinDto) {
    return this.twinsService.createTwin(user.userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user\'s digital twin' })
  @ApiResponse({ status: 200, description: 'Returns the user\'s twin' })
  @ApiResponse({ status: 404, description: 'Digital twin not found' })
  async getTwin(@CurrentUser() user: any) {
    return this.twinsService.getTwin(user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update the authenticated user\'s digital twin' })
  @ApiBody({ type: UpdateTwinDto })
  @ApiResponse({ status: 200, description: 'Digital twin updated successfully' })
  @ApiResponse({ status: 404, description: 'Digital twin not found' })
  async updateTwin(@CurrentUser() user: any, @Body() dto: UpdateTwinDto) {
    return this.twinsService.updateTwin(user.userId, dto);
  }
}
