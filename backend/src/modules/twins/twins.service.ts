import { ConflictException, Injectable, NotFoundException, BadRequestException, forwardRef, Inject, Logger } from '@nestjs/common';
import { TwinsRepository } from './twins.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { AiService } from '../ai/ai.service';
import { Twin } from './entities/twin.entity';
import { TwinStatus } from './enums/twin-status.enum';
import { UpdateTwinDto } from './dto/update-twin.dto';
import { GenerateTwinRequestDto } from '../ai/dto/generate-twin-request.dto';

@Injectable()
export class TwinsService {
  private readonly logger = new Logger(TwinsService.name);

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
    this.logger.log(`[createTwin] Starting twin creation for userId: ${userId}`);

    // Step 1: Retrieve profile
    const profile = await this.profilesService.getProfile(userId);
    if (!profile) {
      this.logger.warn(`[createTwin] Profile not found for userId: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    this.logger.log(`[createTwin] Profile found. Completeness: ${profile.completenessScore}%`);

    if (profile.completenessScore < 60) {
      this.logger.warn(`[createTwin] Profile completeness too low: ${profile.completenessScore}%`);
      throw new BadRequestException('Profile must be at least 60% complete to create a twin');
    }

    // Step 2: Check for existing twin
    const existingTwin = await this.twinsRepository.findByUserId(userId);
    if (existingTwin) {
      this.logger.warn(`[createTwin] Twin already exists for userId: ${userId}`);
      throw new ConflictException('A digital twin already exists for this user');
    }

    // Step 3: Prepare payload for FastAPI
    // FastAPI PersonalityTraits expects values in range 0.0-1.0
    // Profile stores personality scores as 0-100, so normalize them
    const rawPersonality = profile.personality || {};
    const normalizedPersonality: Record<string, number> = {};
    for (const [key, value] of Object.entries(rawPersonality)) {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
      // If value > 1, it's on a 0-100 scale; normalize to 0-1
      normalizedPersonality[key] = numValue > 1 ? numValue / 100 : numValue;
    }

    const generateDto: GenerateTwinRequestDto = {
      personality: normalizedPersonality,
      values: profile.values || [],
      interests: profile.interests || [],
      communicationStyle: profile.communicationStyle || 'casual',
      goals: profile.goals || {},
      lifestyle: profile.lifestyle || {},
      preferences: profile.preferences || {},
    };

    this.logger.log(`[createTwin] Payload for FastAPI:`);
    this.logger.log(`  personality: ${JSON.stringify(generateDto.personality)}`);
    this.logger.log(`  values: ${JSON.stringify(generateDto.values)}`);
    this.logger.log(`  interests: [${generateDto.interests.length} items]`);
    this.logger.log(`  communicationStyle: ${generateDto.communicationStyle}`);
    this.logger.log(`  goals: ${JSON.stringify(generateDto.goals)}`);
    this.logger.log(`  lifestyle: ${JSON.stringify(generateDto.lifestyle)}`);

    // Step 4: Call FastAPI
    this.logger.log(`[createTwin] Calling FastAPI /generate-twin...`);
    const aiResponse = await this.aiService.generateTwin(generateDto);
    this.logger.log(`[createTwin] FastAPI responded successfully. Prompt length: ${aiResponse.systemPrompt?.length || 0} chars`);

    // Step 5: Store twin in Firestore
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

    this.logger.log(`[createTwin] Saving twin to Firestore...`);
    const createdTwin = await this.twinsRepository.create(newTwin as Twin);
    this.logger.log(`[createTwin] Twin created successfully. ID: ${createdTwin.id}`);

    return createdTwin;
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
