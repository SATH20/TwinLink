import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesRepository extends FirebaseRepository<Profile> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'profiles');
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const query = this.collection.where('userId', '==', userId).limit(1);
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Profile;
  }
}
