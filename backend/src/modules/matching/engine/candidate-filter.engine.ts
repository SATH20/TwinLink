import { Injectable, Logger } from '@nestjs/common';

export interface FilteredCandidate {
  profile: any; // Using any for Profile to avoid missing types in this stub if profile entity doesn't exist yet
  passedFilters: string[];
  eliminatedBy?: string;
}

/**
 * Deterministic multi-stage pipeline for filtering candidates.
 * Eliminates incompatible candidates based on hard constraints.
 */
@Injectable()
export class CandidateFilterEngine {
  private readonly logger = new Logger(CandidateFilterEngine.name);

  /**
   * Runs a candidate through the filtering pipeline.
   * @param userProfile The profile of the user seeking a match
   * @param candidates The list of candidate profiles to filter
   * @param userPreferences Optional user preferences
   * @returns List of candidates with their filter results
   */
  filterCandidates(userProfile: any, candidates: any[], userPreferences?: any): FilteredCandidate[] {
    const results: FilteredCandidate[] = [];
    this.logger.log(`[FILTER ENGINE] Starting with ${candidates.length} candidates`);

    for (const candidate of candidates) {
      let eliminatedBy: string | undefined;
      const passedFilters: string[] = [];

      // 1. IntentFilter
      if (this.intentFilter(userProfile, candidate)) {
        passedFilters.push('IntentFilter');
      } else {
        eliminatedBy = 'IntentFilter';
      }

      // 2. AgeFilter
      if (!eliminatedBy) {
        if (this.ageFilter(userProfile, candidate)) {
          passedFilters.push('AgeFilter');
        } else {
          eliminatedBy = 'AgeFilter';
        }
      }

      // 3. GenderPreferenceFilter
      if (!eliminatedBy) {
        if (this.genderPreferenceFilter(userProfile, candidate)) {
          passedFilters.push('GenderPreferenceFilter');
        } else {
          eliminatedBy = 'GenderPreferenceFilter';
        }
      }

      // 4. LocationFilter
      if (!eliminatedBy) {
        if (this.locationFilter(userProfile, candidate)) {
          passedFilters.push('LocationFilter');
        } else {
          eliminatedBy = 'LocationFilter';
        }
      }

      // 5. LanguageFilter
      if (!eliminatedBy) {
        if (this.languageFilter(userProfile, candidate)) {
          passedFilters.push('LanguageFilter');
        } else {
          eliminatedBy = 'LanguageFilter';
        }
      }

      // 6. DealBreakerFilter
      if (!eliminatedBy) {
        if (this.dealBreakerFilter(userProfile, candidate)) {
          passedFilters.push('DealBreakerFilter');
        } else {
          eliminatedBy = 'DealBreakerFilter';
        }
      }

      results.push({
        profile: candidate,
        passedFilters,
        eliminatedBy,
      });
    }

    return results;
  }

  private intentFilter(userProfile: any, candidate: any): boolean {
    const userIntent = userProfile?.goals?.relationship;
    const candidateIntent = candidate?.goals?.relationship;
    
    if (!userIntent || !candidateIntent) return true;
    
    // Compatibility matrix
    if (userIntent === candidateIntent) return true;
    if (userIntent === 'long_term' && candidateIntent === 'open') return true; // example compatibility
    if (userIntent === 'casual' && candidateIntent === 'long_term') return false;
    
    return true; // Fallback
  }

  private ageFilter(userProfile: any, candidate: any): boolean {
    const userAge = userProfile?.age;
    const userMinAge = userProfile?.preferences?.ageRange?.min || 18;
    const userMaxAge = userProfile?.preferences?.ageRange?.max || 100;

    const candidateAge = candidate?.age;
    const candidateMinAge = candidate?.preferences?.ageRange?.min || 18;
    const candidateMaxAge = candidate?.preferences?.ageRange?.max || 100;

    if (!userAge || !candidateAge) return true;

    const userLikesCandidate = candidateAge >= userMinAge && candidateAge <= userMaxAge;
    const candidateLikesUser = userAge >= candidateMinAge && userAge <= candidateMaxAge;

    return userLikesCandidate && candidateLikesUser;
  }

  private genderPreferenceFilter(userProfile: any, candidate: any): boolean {
    const userGender = userProfile?.gender;
    const userPref = userProfile?.preferences?.genderPreference;

    const candidateGender = candidate?.gender;
    const candidatePref = candidate?.preferences?.genderPreference;

    if (!userGender || !candidateGender) return true;
    if (!userPref || !candidatePref) return true;

    const userLikesCandidate = userPref.includes(candidateGender) || userPref.includes('any');
    const candidateLikesUser = candidatePref.includes(userGender) || candidatePref.includes('any');

    return userLikesCandidate && candidateLikesUser;
  }

  private locationFilter(userProfile: any, candidate: any): boolean {
    const userLoc = userProfile?.location?.coordinates;
    const userMaxDist = userProfile?.preferences?.maxDistance;
    const candidateLoc = candidate?.location?.coordinates;

    if (!userLoc || !candidateLoc || !userMaxDist) return true;

    const dist = this.haversineDistance(userLoc.lat, userLoc.lng, candidateLoc.lat, candidateLoc.lng);
    return dist <= userMaxDist;
  }

  private languageFilter(userProfile: any, candidate: any): boolean {
    const userLangs = userProfile?.languages || [];
    const candidateLangs = candidate?.languages || [];

    if (userLangs.length === 0 || candidateLangs.length === 0) return true;

    return userLangs.some((lang: string) => candidateLangs.includes(lang));
  }

  private dealBreakerFilter(userProfile: any, candidate: any): boolean {
    const dealBreakers = userProfile?.preferences?.dealBreakers || [];
    if (dealBreakers.length === 0) return true;

    // IMPORTANT: only compare against the lifestyle VALUES, never the JSON of
    // the whole object. Stringifying the object leaks the field *names*
    // (e.g. "smoking", "drinking"), so a "Smoking" deal breaker used to match
    // the `smoking` key present on EVERY profile — rejecting even non-smokers
    // (`smoking: "no"`) and eliminating every candidate.
    const candidateValues = Object.values(candidate?.lifestyle || {})
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.toLowerCase());

    for (const db of dealBreakers) {
      const needle = db.toLowerCase();
      if (candidateValues.some((value) => value.includes(needle))) {
        return false;
      }
    }

    return true;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
