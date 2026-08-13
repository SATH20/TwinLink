import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { Twin } from './entities/twin.entity';
import { TwinStatus } from './enums/twin-status.enum';

@Injectable()
export class TwinsRepository extends FirebaseRepository<Twin> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'twins');
  }

  /**
   * Find a twin by user ID
   * @param userId The ID of the user
   * @returns The twin entity or null if not found
   */
  async findByUserId(userId: string): Promise<Twin | null> {
    const twins = await this.findByField('userId', userId);
    return twins.length > 0 ? twins[0] : null;
  }

  /**
   * Find twins eligible to wake up
   * @param currentTime ISO timestamp to check against nextWake
   * @returns Array of eligible twins
   */
  async findEligibleForWake(currentTime: string): Promise<Twin[]> {
    const activeTwins = await this.findByField('status', TwinStatus.ACTIVE);
    const sleepingTwins = await this.findByField('status', TwinStatus.SLEEPING);
    
    const candidates = [...activeTwins, ...sleepingTwins];
    return candidates.filter(twin => twin.nextWake <= currentTime);
  }

  /**
   * Find all active or searching twins
   * @returns Array of active twins
   */
  async findActiveTwins(): Promise<Twin[]> {
    const activeTwins = await this.findByField('status', TwinStatus.ACTIVE);
    const searchingTwins = await this.findByField('status', TwinStatus.SEARCHING);
    return [...activeTwins, ...searchingTwins];
  }

  /**
   * Update a twin's status
   * @param twinId The ID of the twin
   * @param status The new status
   * @returns The updated twin
   */
  async updateStatus(twinId: string, status: TwinStatus): Promise<Twin> {
    return this.update(twinId, { status } as Partial<Twin>);
  }
}
