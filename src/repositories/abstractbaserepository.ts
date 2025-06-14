// this code is not used anywhere in the project, its just for refereence and its nestjs

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import {
//   Model,
//   Document,
//   FilterQuery,
//   QueryOptions,
//   UpdateQuery,
//   ProjectionType,
//   PopulateOptions,
// } from 'mongoose';

// @Injectable()
// export abstract class BaseRepository<T extends Document> {
//   constructor(@InjectModel('') private readonly model: Model<T>) {}


import {
  Model,
  Document,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  ProjectionType,
  PopulateOptions,
} from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // ==================== CRUD Operations ====================

  /**
   * Create a new document.
   * @param item - The document data to create.
   * @returns The created document.
   */
  async create(item: FilterQuery<T>): Promise<T> {
    return this.model.create(item);
  }

  /**
   * Find a document by its ID.
   * @param id - The document ID.
   * @param projection - Fields to include/exclude in the result.
   * @param options - Additional query options.
   * @param populateOptions - Fields to populate.
   * @returns The document or null if not found.
   */
  async findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let query = this.model.findById(id, projection, options);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    return query.exec();
  }

  /**
   * Find a single document by query.
   * @param filter - The query filter.
   * @param projection - Fields to include/exclude in the result.
   * @param options - Additional query options.
   * @param populateOptions - Fields to populate.
   * @returns The document or null if not found.
   */
  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let query = this.model.findOne(filter, projection, options);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    return query.exec();
  }

  /**
   * Find all documents matching the query.
   * @param filter - The query filter.
   * @param projection - Fields to include/exclude in the result.
   * @param options - Additional query options.
   * @param populateOptions - Fields to populate.
   * @returns An array of documents.
   */
  async findAll(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<T[]> {
    let query = this.model.find(filter, projection, options);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    return query.exec();
  }

  /**
   * Update a document by its ID.
   * @param id - The document ID.
   * @param update - The update query.
   * @param options - Additional query options.
   * @returns The updated document or null if not found.
   */
  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, ...options })
      .exec();
  }

  /**
   * Update a single document by query.
   * @param filter - The query filter.
   * @param update - The update query.
   * @param options - Additional query options.
   * @returns The updated document or null if not found.
   */
  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, ...options })
      .exec();
  }

  /**
   * Delete a document by its ID.
   * @param id - The document ID.
   * @param options - Additional query options.
   * @returns The deleted document or null if not found.
   */
  async findByIdAndDelete(
    id: string,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  /**
   * Delete a single document by query.
   * @param filter - The query filter.
   * @param options - Additional query options.
   * @returns The deleted document or null if not found.
   */
  async deleteOne(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOneAndDelete(filter, options).exec();
  }

  // ==================== Utility Methods ====================

  /**
   * Count documents matching the query.
   * @param filter - The query filter.
   * @returns The number of documents.
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /**
   * Check if a document exists.
   * @param filter - The query filter.
   * @returns True if documents exist, otherwise false.
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter).exec();
    return count > 0;
  }

  /**
   * Populate referenced documents.
   * @param docs - The document(s) to populate.
   * @param paths - Fields to populate.
   * @returns The populated document(s).
   */
  async populate(
    docs: T | T[],
    paths: PopulateOptions | PopulateOptions[],
  ): Promise<T | T[]> {
    return this.model.populate(docs, paths);
  }
}
