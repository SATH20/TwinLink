import { Gender } from '../enums/gender.enum';

/** Who can view the full profile. */
export type ProfileVisibility = 'public' | 'connections';

export interface ProfilePrivacy {
  /** 'public' = anyone; 'connections' = only accepted connections see details. */
  profileVisibility: ProfileVisibility;
  /** When false, the user's Twin is excluded from other users' recommendations. */
  includeInMatching: boolean;
}

export interface NotificationPreferences {
  connectionRequests: boolean;
  connectionAccepted: boolean;
  newMessages: boolean;
  twinUpdates: boolean;
}

export class Profile {
  id: string;
  userId: string;
  age: number;
  gender: Gender;
  bio?: string;
  location: {
    city: string;
    state?: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  values: string[];
  interests: string[];
  communicationStyle: string;
  goals: {
    relationship: string;
    personal: string[];
    timeline?: string;
  };
  preferences: {
    ageRange: { min: number; max: number };
    genderPreference: Gender[];
    maxDistance?: number;
    dealBreakers: string[];
  };
  dealBreakers: string[];
  lifestyle: {
    schedule: string;
    socialLevel: string;
    exercise: string;
    diet?: string;
    smoking?: string;
    drinking?: string;
  };
  languages: string[];
  profession: {
    title: string;
    industry?: string;
    company?: string;
  };
  /** Privacy / matching-visibility controls (managed from Settings → Privacy). */
  privacy?: ProfilePrivacy;
  /** Per-type notification preferences (managed from Settings → Notifications). */
  notificationPreferences?: NotificationPreferences;
  completenessScore: number;
  createdAt: string;
  updatedAt: string;
}
