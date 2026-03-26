// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface CreateTwinPayload {
  userId: string;
  email: string;
  interests: string[];
  communicationStyle: string;
  goals: string;
  personality: {
    introvertExtrovert: number;
    analyticalCreative: number;
    seriousPlayful: number;
  };
  category: string;
}

export interface TwinResponse {
  message: string;
  twinId: string;
  data: any;
  error?: string;
}

export interface UserCheckResponse {
  message: string;
  twinId: string | null;
  category?: string | null;
  email?: string | null;
  error?: string;
}

export interface MatchResponse {
  message: string;
  currentTwinId: string;
  matches: Array<{
    id: string;
    matchScore: number;
    reason: string;
    interests: string[];
  }>;
  error?: string;
}

// Create a new digital twin
export async function createTwin(payload: CreateTwinPayload): Promise<TwinResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/twin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating twin:', error);
    throw error;
  }
}

// Check if user already has a twin
export async function checkUserTwin(userId: string): Promise<UserCheckResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/twin/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user twin:', error);
    throw error;
  }
}

// Get top matches for a twin
export async function getMatches(twinId: string): Promise<MatchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/twin/matches/${twinId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}
