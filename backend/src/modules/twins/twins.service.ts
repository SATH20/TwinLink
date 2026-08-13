import { ConflictException, Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { TwinsRepository } from './twins.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { AiService } from '../ai/ai.service';
import { Twin } from './entities/twin.entity';
import { TwinStatus } from './enums/twin-status.enum';
import { UpdateTwinDto } from './dto/update-twin.dto';
import { GenerateTwinRequestDto } from '../ai/dto/generate-twin-request.dto';

@Injectable()
export class TwinsService {
  constructor(
    private readonly twinsRepository: TwinsRepository,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    private readonly aiService: AiService,
  ) {}

  /**
   * Create a new digital twin for a user
   * @param userId The ID of the user
   * @returns The newly created twin
   */
  async createTwin(userId: string): Promise<Twin> {
    const profile = await this.profilesService.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.completenessScore < 60) {
      throw new BadRequestException('Profile must be at least 60% complete to create a twin');
    }

    const existingTwin = await this.twinsRepository.findByUserId(userId);
    if (existingTwin) {
      throw new ConflictException('A digital twin already exists for this user');
    }

    const generateDto: GenerateTwinRequestDto = {
      personality: profile.personality || {},
      values: profile.values || [],
      interests: profile.interests || [],
      communicationStyle: profile.communicationStyle || 'casual',
      goals: profile.goals || {},
      lifestyle: profile.lifestyle || {},
      preferences: profile.preferences || {},
    };

    const aiResponse = await this.aiService.generateTwin(generateDto);

    const now = new Date().toISOString();
    const nextWake = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newTwin: Partial<Twin> = {
      userId,
      systemPrompt: aiResponse.systemPrompt,
      memory: {
        conversations: [],
        matchHistory: [],
        insights: [],
        preferences: {},
      },
      status: TwinStatus.CREATED,
      nextWake,
      lastWake: now,
      version: 1,
    };

    return this.twinsRepository.create(newTwin as Twin);
  }

  /**
   * Get a user's digital twin
   * @param userId The ID of the user
   * @returns The twin entity
   */
  async getTwin(userId: string): Promise<Twin> {
    const twin = await this.twinsRepository.findByUserId(userId);
    if (!twin) {
      throw new NotFoundException('Digital twin not found');
    }
    return twin;
  }

  /**
   * Update a user's digital twin
   * @param userId The ID of the user
   * @param dto The update data
   * @returns The updated twin
   */
  async updateTwin(userId: string, dto: UpdateTwinDto): Promise<Twin> {
    const twin = await this.getTwin(userId);
    const updateData: Partial<Twin> = {
      ...dto,
      version: twin.version + 1,
    };

    if (dto.customPromptAdditions) {
      updateData.systemPrompt = `${twin.systemPrompt}\n\nCustom Instructions: ${dto.customPromptAdditions}`;
    }

    return this.twinsRepository.update(twin.id, updateData);
  }

  /**
   * Activate a twin
   * @param twinId The ID of the twin
   * @returns The updated twin
   */
  async activateTwin(twinId: string): Promise<Twin> {
    return this.updateStatus(twinId, TwinStatus.ACTIVE);
  }

  /**
   * Update a twin's status
   * @param twinId The ID of the twin
   * @param status The new status
   * @returns The updated twin
   */
  async updateStatus(twinId: string, status: string | TwinStatus): Promise<Twin> {
    const twinStatus = status as TwinStatus;
    await this.twinsRepository.update(twinId, { status: twinStatus } as Partial<Twin>);
    const updated = await this.twinsRepository.findById(twinId);
    if (!updated) {
      throw new NotFoundException(`Twin with ID ${twinId} not found`);
    }
    return updated;
  }

  /**
   * Get twins eligible for wake up
   * @param currentTime ISO timestamp
   * @returns Array of eligible twins
   */
  async getEligibleTwins(currentTime: string): Promise<Twin[]> {
    return this.twinsRepository.findEligibleForWake(currentTime);
  }

  /**
   * Update a twin's next wake time
   * @param twinId The ID of the twin
   * @param nextWake ISO timestamp
   */
  async updateTwinWake(twinId: string, nextWake: string): Promise<void> {
    await this.twinsRepository.update(twinId, { nextWake } as Partial<Twin>);
  }

  /**
   * Add memory to a twin
   * @param twinId The ID of the twin
   * @param type The type of memory
   * @param value The value to add
   */
  async addMemory(twinId: string, type: 'conversation' | 'match' | 'insight', value: string): Promise<void> {
    const twin = await this.twinsRepository.findById(twinId);
    if (!twin) {
      throw new NotFoundException(`Twin with ID ${twinId} not found`);
    }

    const memory = { ...twin.memory };
    
    switch (type) {
      case 'conversation':
        if (!memory.conversations.includes(value)) memory.conversations.push(value);
        break;
      case 'match':
        if (!memory.matchHistory.includes(value)) memory.matchHistory.push(value);
        break;
      case 'insight':
        if (!memory.insights.includes(value)) memory.insights.push(value);
        break;
    }

    await this.twinsRepository.update(twinId, { memory } as Partial<Twin>);
  }
}
