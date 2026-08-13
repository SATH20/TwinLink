import { Gender } from '../enums/gender.enum';

export class Profile {
  id: string;
  userId: string;
  age: number;
  gender: Gender;
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
  completenessScore: number;
  createdAt: string;
  updatedAt: string;
}
