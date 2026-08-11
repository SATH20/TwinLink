import { Injectable, Logger } from '@nestjs/common';
import { seedUsers, SeedUserData } from './seed-data';
import { UsersRepository } from '../users/users.repository';
import { ProfilesRepository } from '../profiles/profiles.repository';
import { TwinsRepository } from '../twins/twins.repository';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Twin } from '../twins/entities/twin.entity';
import { TwinStatus } from '../twins/enums/twin-status.enum';

interface SeedResult {
  userId: string;
  email: string;
  name: string;
  profileId: string;
  twinId: string;
  success: boolean;
  error?: string;
}

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly twinsRepository: TwinsRepository,
  ) {}

  /**
   * Seed database with test users
   */
  async seedTestUsers(): Promise<{
    totalUsers: number;
    successCount: number;
    failureCount: number;
    results: SeedResult[];
  }> {
    this.logger.log('Starting test user seeding...');
    const results: SeedResult[] = [];

    for (const userData of seedUsers) {
      try {
        this.logger.log(`Creating user: ${userData.name}`);
        const result = await this.createTestUser(userData);
        results.push(result);
        
        if (result.success) {
          this.logger.log(`✅ Successfully created: ${userData.name}`);
        } else {
          this.logger.warn(`❌ Failed to create: ${userData.name} - ${result.error}`);
        }
      } catch (error) {
        this.logger.error(`Error creating ${userData.name}:`, error);
        results.push({
          userId: '',
          email: userData.email,
          name: userData.name,
          profileId: '',
          twinId: '',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    this.logger.log(`Seeding complete: ${successCount} success, ${failureCount} failures`);

    return {
      totalUsers: seedUsers.length,
      successCount,
      failureCount,
      results,
    };
  }

  /**
   * Create a single test user with profile and twin
   */
  private async createTestUser(userData: SeedUserData): Promise<SeedResult> {
    try {
      // 1. Create User
      const user = await this.createUser(userData);

      // 2. Create Profile
      const profile = await this.createProfile(user.id, userData);

      // 3. Create Twin
      const twin = await this.createTwin(user.id, userData);

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        profileId: profile.id,
        twinId: twin.id,
        success: true,
      };
    } catch (error) {
      return {
        userId: '',
        email: userData.email,
        name: userData.name,
        profileId: '',
        twinId: '',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Create user entity
   */
  private async createUser(userData: SeedUserData): Promise<User> {
    const now = new Date().toISOString();
    const newUser: Partial<User> = {
      email: userData.email,
      name: userData.name,
      clerkId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      createdAt: now,
      updatedAt: now,
    };

    // Mark as dev/test user
    (newUser as any).isDevelopmentUser = true;
    (newUser as any).seed = true;

    return this.usersRepository.create(newUser as User);
  }

  /**
   * Create profile entity
   */
  private async createProfile(userId: string, userData: SeedUserData): Promise<Profile> {
    const now = new Date().toISOString();
    const newProfile: Partial<Profile> = {
      userId,
      age: userData.age,
      gender: userData.gender as any,
      location: userData.location,
      personality: userData.personality,
      values: userData.values,
      interests: userData.interests,
      communicationStyle: userData.communicationStyle,
      goals: userData.goals,
      lifestyle: userData.lifestyle,
      languages: userData.languages,
      profession: userData.profession,
      preferences: {
        ageRange: {
          min: Math.max(18, userData.age - 5),
          max: userData.age + 5,
        },
        genderPreference: userData.gender === 'MALE' ? ['FEMALE' as any] : ['MALE' as any],
        maxDistance: 50,
        dealBreakers: [],
      },
      dealBreakers: [],
      completenessScore: 100,
      createdAt: now,
      updatedAt: now,
    };

    // Mark as dev/test profile
    (newProfile as any).isDevelopmentUser = true;
    (newProfile as any).seed = true;

    return this.profilesRepository.create(newProfile as Profile);
  }

  /**
   * Create twin entity
   */
  private async createTwin(userId: string, userData: SeedUserData): Promise<Twin> {
    const systemPrompt = this.generateSystemPrompt(userData);
    const now = new Date().toISOString();
    const nextWake = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newTwin: Partial<Twin> = {
      userId,
      systemPrompt,
      memory: {
        conversations: [],
        matchHistory: [],
        insights: [],
        preferences: {},
      },
      status: TwinStatus.CREATED,
      lastWake: now,
      nextWake,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Mark as dev/test twin
    (newTwin as any).isDevelopmentUser = true;
    (newTwin as any).seed = true;

    return this.twinsRepository.create(newTwin as Twin);
  }

  /**
   * Generate system prompt for twin
   */
  private generateSystemPrompt(userData: SeedUserData): string {
    return `You are the Digital Twin of ${userData.name}, a ${userData.age}-year-old ${userData.profession.title} from ${userData.location.city}, India.

PERSONALITY:
- Openness: ${userData.personality.openness}/100
- Conscientiousness: ${userData.personality.conscientiousness}/100
- Extraversion: ${userData.personality.extraversion}/100
- Agreeableness: ${userData.personality.agreeableness}/100
- Emotional Stability: ${100 - userData.personality.neuroticism}/100

COMMUNICATION STYLE: ${userData.communicationStyle}

CORE VALUES: ${userData.values.join(', ')}

INTERESTS: ${userData.interests.join(', ')}

RELATIONSHIP GOAL: ${userData.goals.relationship}

PERSONAL GOALS:
${userData.goals.personal.map(g => `- ${g}`).join('\n')}

LIFESTYLE:
- Social Level: ${userData.lifestyle.socialLevel}
- Exercise: ${userData.lifestyle.exercise}
- Diet: ${userData.lifestyle.diet}

Your role is to represent ${userData.name} authentically in conversations with other Digital Twins. Evaluate compatibility based on personality alignment, shared values, interests, and life goals. Communicate in a ${userData.communicationStyle} manner that reflects their personality traits.`;
  }

  /**
   * List all seeded test users along with their profile and twin.
   */
  async listTestUsers(): Promise<{
    count: number;
    users: Array<User & { profile: Profile | null; twin: Twin | null }>;
  }> {
    this.logger.log('Listing seeded test users...');

    // All seeded docs are tagged with `seed: true`
    const users = await this.usersRepository.findByField('seed', true);

    const enriched = await Promise.all(
      users.map(async (user) => {
        const profiles = await this.profilesRepository.findByField('userId', user.id);
        const twins = await this.twinsRepository.findByField('userId', user.id);
        return {
          ...user,
          profile: profiles[0] ?? null,
          twin: twins[0] ?? null,
        };
      }),
    );

    return { count: enriched.length, users: enriched };
  }

  /**
   * Clean up all seeded test users (and their profiles + twins).
   */
  async cleanupTestUsers(): Promise<{ deletedCount: number }> {
    this.logger.log('Cleaning up test users...');
    let deletedCount = 0;

    try {
      const users = await this.usersRepository.findByField('seed', true);

      for (const user of users) {
        const profiles = await this.profilesRepository.findByField('userId', user.id);
        const twins = await this.twinsRepository.findByField('userId', user.id);

        await Promise.all([
          ...profiles.map((p) => this.profilesRepository.delete(p.id)),
          ...twins.map((t) => this.twinsRepository.delete(t.id)),
        ]);
        await this.usersRepository.delete(user.id);
        deletedCount++;
      }

      this.logger.log(`Cleanup complete: deleted ${deletedCount} test users`);
      return { deletedCount };
    } catch (error) {
      this.logger.error('Error cleaning up test users:', error);
      throw error;
    }
  }
}
