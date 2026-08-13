import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  /**
   * Gets a profile by user ID.
   * @param userId The ID of the user
   * @returns The user's profile
   * @throws NotFoundException if profile is not found
   */
  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  /**
   * Gets all profiles. Used by the matching engine to build the candidate pool.
   * @returns All profiles in the collection
   */
  async getAllProfiles(): Promise<Profile[]> {
    return this.profilesRepository.findAll();
  }

  /**
   * Updates a user's profile.
   * @param userId The ID of the user
   * @param dto The profile update data
   * @returns The updated profile
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    let profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      profile = await this.createProfile(userId);
    }
    
    const updatedData: Partial<Profile> = {
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    
    await this.profilesRepository.update(profile.id, updatedData);
    
    const updatedProfile = await this.profilesRepository.findByUserId(userId);
    if (updatedProfile) {
      const completenessScore = this.calculateCompleteness(updatedProfile);
      await this.profilesRepository.update(profile.id, { completenessScore });
      updatedProfile.completenessScore = completenessScore;
      return updatedProfile;
    }
    
    throw new NotFoundException('Profile not found after update');
  }

  /**
   * Creates an empty skeleton profile for a user.
   * @param userId The ID of the user
   * @returns The created profile
   */
  async createProfile(userId: string): Promise<Profile> {
    const now = new Date().toISOString();
    const newProfile: Partial<Profile> = {
      userId,
      completenessScore: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    return this.profilesRepository.create(newProfile as any);
  }

  /**
   * Calculates the completeness score of a profile based on filled fields.
   * @param profile The profile object
   * @returns The completeness percentage (0-100)
   */
  calculateCompleteness(profile: Profile): number {
    const fieldsToCheck = [
      'age', 'gender', 'location', 'personality', 'values', 'interests',
      'communicationStyle', 'goals', 'preferences', 'dealBreakers',
      'lifestyle', 'languages', 'profession'
    ];
    
    let filledFields = 0;
    for (const field of fieldsToCheck) {
      if (profile[field as keyof Profile] !== undefined && profile[field as keyof Profile] !== null) {
        filledFields++;
      }
    }
    
    return Math.round((filledFields / fieldsToCheck.length) * 100);
  }
}
