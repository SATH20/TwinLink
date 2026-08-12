import * as admin from 'firebase-admin';
import { IRepository } from '../common/interfaces/repository.interface';

/**
 * Abstract Generic Firebase Repository implementing IRepository interface.
 *
 * Receives a fully-initialized Firestore instance through DI (provided by the
 * FIRESTORE factory provider), so the collection reference can be resolved
 * safely at construction time — no lifecycle race.
 */
export abstract class FirebaseRepository<T extends { id?: string }> implements IRepository<T> {
  protected collection: admin.firestore.CollectionReference;

  constructor(
    protected readonly firestore: admin.firestore.Firestore,
    protected readonly collectionName: string,
  ) {
    this.collection = this.firestore.collection(this.collectionName);
  }

  /**
   * Helper to map a Firestore document snapshot to the entity Type T.
   */
  protected mapDocToEntity(doc: admin.firestore.DocumentSnapshot): T {
    if (!doc.exists) {
      return null as any;
    }
    return { id: doc.id, ...doc.data() } as T;
  }

  /**
   * Finds an entity by ID.
   */
  async findById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.mapDocToEntity(doc);
  }

  /**
   * Finds all entities matching exact field equality filters.
   */
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query: admin.firestore.Query = this.collection;
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.where(key, '==', value);
        }
      });
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => this.mapDocToEntity(doc));
  }

  /**
   * Finds entities by a specific field and operator.
   */
  async findByField(field: string, value: any): Promise<T[]> {
    const snapshot = await this.collection.where(field, '==', value).get();
    return snapshot.docs.map(doc => this.mapDocToEntity(doc));
  }

  /**
   * Finds entities with complex field filters.
   */
  async findByFields(
    filters: { field: string; op: admin.firestore.WhereFilterOp; value: any }[]
  ): Promise<T[]> {
    let query: admin.firestore.Query = this.collection;
    filters.forEach(filter => {
      query = query.where(filter.field, filter.op, filter.value);
    });
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => this.mapDocToEntity(doc));
  }

  /**
   * Creates a new entity. Auto-generates ID if not provided. Adds timestamps.
   */
  async create(data: Partial<T>): Promise<T> {
    const now = new Date().toISOString();
    const dataWithTimestamps = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    let docRef: admin.firestore.DocumentReference;
    
    if (data.id) {
      docRef = this.collection.doc(data.id);
      const dataToSave = { ...dataWithTimestamps };
      delete (dataToSave as any).id; 
      await docRef.set(dataToSave);
    } else {
      docRef = await this.collection.add(dataWithTimestamps);
    }

    return this.findById(docRef.id) as Promise<T>;
  }

  /**
   * Updates an entity by ID. Merges data and updates the timestamp.
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const dataToUpdate = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // Remove id from the update payload if it exists
    delete (dataToUpdate as any).id;

    await this.collection.doc(id).set(dataToUpdate, { merge: true });
    return this.findById(id) as Promise<T>;
  }

  /**
   * Deletes an entity by ID.
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Finds entities with pagination and basic filters.
   */
  async findWithPagination(
    page: number,
    limit: number,
    filters?: Record<string, any>
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    let baseQuery: admin.firestore.Query = this.collection;

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          baseQuery = baseQuery.where(key, '==', value);
        }
      });
    }

    // Get total count
    const countSnapshot = await baseQuery.count().get();
    const total = countSnapshot.data().count;

    // Ordered query for pagination
    let paginatedQuery = baseQuery.orderBy('createdAt', 'desc');

    if (page > 1) {
      // Offset-based pagination is less efficient but required if we only have 'page' number
      // For large datasets in Firestore, cursor-based pagination is recommended. 
      // Using offset here to satisfy the `page` argument.
      const offset = (page - 1) * limit;
      paginatedQuery = paginatedQuery.offset(offset);
    }

    paginatedQuery = paginatedQuery.limit(limit);

    const snapshot = await paginatedQuery.get();
    const data = snapshot.docs.map(doc => this.mapDocToEntity(doc));

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
