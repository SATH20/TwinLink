import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { Match } from './entities/match.entity';
import { MatchStatus } from './enums/match-status.enum';

/**
 * Repository for managing matches in Firestore.
 */
@Injectable()
export class MatchingRepository extends FirebaseRepository<Match> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'matches');
  }

  /**
   * Finds all matches where the user is either userA or userB.
   * @param userId The user ID
   * @returns A promise resolving to an array of matches
   */
  async findByUserId(userId: string): Promise<Match[]> {
    const ref = this.collection;
    const queryA = await ref.where('userA', '==', userId).get();
    const queryB = await ref.where('userB', '==', userId).get();
    
    const matches: Match[] = [];
    queryA.forEach((doc: any) => matches.push({ id: doc.id, ...doc.data() } as Match));
    queryB.forEach((doc: any) => matches.push({ id: doc.id, ...doc.data() } as Match));
    
    // Deduplicate just in case
    return Array.from(new Map(matches.map(m => [m.id, m])).values());
  }

  /**
   * Finds an existing match between two users.
   * @param userA First user ID
   * @param userB Second user ID
   * @returns A promise resolving to the match or null
   */
  async findByUserPair(userA: string, userB: string): Promise<Match | null> {
    const ref = this.collection;
    // Try both combinations
    let snapshot = await ref.where('userA', '==', userA).where('userB', '==', userB).get();
    if (snapshot.empty) {
      snapshot = await ref.where('userA', '==', userB).where('userB', '==', userA).get();
    }
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Match;
  }

  /**
   * Finds active (non-rejected) matches for a user.
   * @param userId The user ID
   * @returns A promise resolving to an array of active matches
   */
  async findActiveMatches(userId: string): Promise<Match[]> {
    const allMatches = await this.findByUserId(userId);
    return allMatches.filter(m => m.status !== MatchStatus.REJECTED);
  }

  /**
   * Updates the status of a match.
   * @param matchId The match ID
   * @param status The new status
   * @returns A promise resolving to the updated match
   */
  async updateStatus(matchId: string, status: MatchStatus): Promise<Match> {
    await this.update(matchId, { status });
    return this.findById(matchId) as Promise<Match>;
  }
}
