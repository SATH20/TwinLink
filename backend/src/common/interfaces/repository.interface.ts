/**
 * Generic Repository Interface
 * Defines standard CRUD operations for all entities.
 */
export interface IRepository<T> {
  /**
   * Finds an entity by its ID.
   * @param id The ID of the entity.
   * @returns The entity or null if not found.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Finds all entities matching the optional filters.
   * @param filters Optional key-value pairs to filter results.
   * @returns Array of entities.
   */
  findAll(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Creates a new entity.
   * @param data The partial entity data to create.
   * @returns The created entity.
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Updates an existing entity.
   * @param id The ID of the entity to update.
   * @param data The partial data to update.
   * @returns The updated entity.
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Deletes an entity by ID.
   * @param id The ID of the entity to delete.
   */
  delete(id: string): Promise<void>;

  /**
   * Finds entities with pagination and optional filters.
   * @param page The page number (1-indexed).
   * @param limit The number of items per page.
   * @param filters Optional filters.
   * @returns Paginated result object.
   */
  findWithPagination(
    page: number,
    limit: number,
    filters?: Record<string, any>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;
}
