import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import * as admin from 'firebase-admin';
import { ProfilesRepository } from './profiles.repository';
import { Profile, ProfilePrivacy, NotificationPreferences } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersRepository } from '../users/users.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';

/** Sensible defaults so a profile that predates the settings feature behaves as before. */
export const DEFAULT_PRIVACY: ProfilePrivacy = {
  profileVisibility: 'public',
  includeInMatching: true,
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  connectionRequests: true,
  connectionAccepted: true,
  newMessages: true,
  twinUpdates: true,
};

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly usersRepository: UsersRepository,
    @Inject(FIRESTORE) private readonly firestore: admin.firestore.Firestore,
  ) {}

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
    return this.applySettingsDefaults(profile);
  }

  /** Ensure privacy + notificationPreferences are always present (non-persisted). */
  private applySettingsDefaults(profile: Profile): Profile {
    return {
      ...profile,
      privacy: { ...DEFAULT_PRIVACY, ...(profile.privacy || {}) },
      notificationPreferences: {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...(profile.notificationPreferences || {}),
      },
    };
  }

  /**
   * Returns true when `requesterId` and `targetUserId` have an ACCEPTED
   * connection. Uses a direct Firestore read (the connections collection is the
   * single source of truth) to avoid a module dependency cycle.
   */
  private async areConnected(requesterId: string, targetUserId: string): Promise<boolean> {
    const col = this.firestore.collection('connections');
    const [a, b] = await Promise.all([
      col.where('currentUserId', '==', requesterId).where('targetUserId', '==', targetUserId).get(),
      col.where('currentUserId', '==', targetUserId).where('targetUserId', '==', requesterId).get(),
    ]);
    const docs = [...a.docs, ...b.docs];
    return docs.some((d) => (d.data() as any)?.status === 'ACCEPTED');
  }

  /**
   * Gets a public-facing profile for another user, merged with the real
   * display name from the User document. Used to enrich match recommendations.
   *
   * Honors the profile's privacy setting: when visibility is 'connections' and
   * the requester is neither the owner nor an accepted connection, only the
   * non-sensitive display fields (name, avatar) are returned, flagged with
   * `limitedVisibility`. Email / phone / auth details are never returned.
   *
   * @param userId The ID of the user whose profile is requested
   * @param requesterId The authenticated requester's id (for visibility checks)
   * @throws NotFoundException if the profile is not found
   */
  async getPublicProfile(
    userId: string,
    requesterId?: string,
  ): Promise<Profile & { name: string; avatar?: string; limitedVisibility?: boolean }> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // The `userId` on a match/conversation/connection can be either the internal
    // Firestore user document id (seeded users) or the Clerk id (real users).
    // Resolve the User by document id first, then fall back to the Clerk id so
    // the real display name is always returned — never an empty name that the
    // UI would replace with a placeholder or (incorrectly) the profession.
    let user = await this.usersRepository.findById(userId);
    if (!user) {
      user = await this.usersRepository.findByClerkId(userId);
    }

    const name = user?.name ?? '';
    const avatar = (user as any)?.avatar ?? undefined;

    const visibility = profile.privacy?.profileVisibility ?? DEFAULT_PRIVACY.profileVisibility;
    const isOwner = !!requesterId && requesterId === userId;

    if (visibility === 'connections' && !isOwner) {
      const connected = requesterId ? await this.areConnected(requesterId, userId) : false;
      if (!connected) {
        // Redacted view — only the display name/avatar are exposed.
        return {
          id: profile.id,
          userId: profile.userId,
          name,
          avatar,
          limitedVisibility: true,
        } as Profile & { name: string; avatar?: string; limitedVisibility?: boolean };
      }
    }

    return {
      ...this.applySettingsDefaults(profile),
      name,
      avatar,
    };
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

    const plainDto = instanceToPlain(dto) as Partial<Profile>;
    
    const updatedData: Partial<Profile> = {
      ...plainDto,
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
   * Update privacy and/or notification-preference settings on the profile.
   * Merges onto any existing values so each Settings sub-section can be saved
   * independently without clobbering the other.
   */
  async updateSettings(userId: string, dto: UpdateSettingsDto): Promise<Profile> {
    let profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      profile = await this.createProfile(userId);
    }

    const update: Partial<Profile> = { updatedAt: new Date().toISOString() };

    if (dto.privacy) {
      update.privacy = {
        ...DEFAULT_PRIVACY,
        ...(profile.privacy || {}),
        ...dto.privacy,
      };
    }

    if (dto.notificationPreferences) {
      update.notificationPreferences = {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...(profile.notificationPreferences || {}),
        ...dto.notificationPreferences,
      };
    }

    await this.profilesRepository.update(profile.id, update);
    return this.getProfile(userId);
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
