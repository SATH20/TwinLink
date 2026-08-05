import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { FIRESTORE } from '../../firebase/firebase.constants';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends FirebaseRepository<User> {
  constructor(@Inject(FIRESTORE) firestore: admin.firestore.Firestore) {
    super(firestore, 'users');
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    const query = this.collection.where('clerkId', '==', clerkId).limit(1);
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = this.collection.where('email', '==', email).limit(1);
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }
}
