/* eslint-disable @typescript-eslint/no-explicit-any */
// Disable the ESLint rule for explicit 'any' types in this file
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import necessary modules and dependencies
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { addDays } from 'date-fns';
import { Model, Types, ProjectionType, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { DalException } from '../shared';

// Create a base repository class for MongoDB operations
export class BaseRepository<T_DBModel, T_MappedEntity, T_Enforcement> {
  public _model: Model<T_DBModel>;

  constructor(protected MongooseModel: Model<T_DBModel>, protected entity: ClassConstructor<T_MappedEntity>) {
    this._model = MongooseModel;
  }

  // Static method to create a new MongoDB ObjectId
  public static createObjectId() {
    return new Types.ObjectId().toString();
  }

  // Helper function to convert a MongoDB ObjectId to a string
  protected convertObjectIdToString(value: Types.ObjectId): string {
    return value.toString();
  }

  // Helper function to convert a string to a MongoDB ObjectId
  protected convertStringToObjectId(value: string): Types.ObjectId {
    return new Types.ObjectId(value);
  }

  // Asynchronously count documents in the MongoDB collection
  async count(query: FilterQuery<T_DBModel> & T_Enforcement, limit?: number): Promise<number> {
    return this.MongooseModel.countDocuments(query, {
      limit,
    });
  }

  // Asynchronously perform an aggregation on the MongoDB collection
  async aggregate(query: any[], options: { readPreference?: 'secondaryPreferred' | 'primary' } = {}): Promise<any> {
    return await this.MongooseModel.aggregate(query).read(options.readPreference || 'primary');
  }

  // Asynchronously find and return one document from the MongoDB collection
  async findOne(
    query: FilterQuery<T_DBModel> & T_Enforcement,
    select?: ProjectionType<T_MappedEntity>,
    options: { readPreference?: 'secondaryPreferred' | 'primary'; query?: QueryOptions<T_DBModel> } = {}
  ): Promise<T_MappedEntity | null> {
    const data = await this.MongooseModel.findOne(query, select, options.query).read(
      options.readPreference || 'primary'
    );
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  // Asynchronously delete multiple documents from the MongoDB collection
  async delete(query: FilterQuery<T_DBModel> & T_Enforcement): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> {
    return await this.MongooseModel.deleteMany(query);
  }

  // Asynchronously find and return multiple documents from the MongoDB collection
  async find(
    query: FilterQuery<T_DBModel> & T_Enforcement,
    select: ProjectionType<T_MappedEntity> = '',
    options: { limit?: number; sort?: any; skip?: number } = {}
  ): Promise<T_MappedEntity[]> {
    const data = await this.MongooseModel.find(query, select, {
      sort: options.sort || null,
    })
      .skip(options.skip as number)
      .limit(options.limit as number)
      .lean()
      .exec();

    return this.mapEntities(data);
  }

  // Asynchronously find and return documents in batches from the MongoDB collection
  async *findBatch(
    query: FilterQuery<T_DBModel> & T_Enforcement,
    select = '',
    options: { limit?: number; sort?: any; skip?: number } = {},
    batchSize = 500
  ) {
    for await (const doc of this._model
      .find(query, select, {
        sort: options.sort || null,
      })
      .batchSize(batchSize)
      .cursor()) {
      yield this.mapEntity(doc);
    }
  }

  // Calculate an expiration date based on the model name and data
  private calcExpireDate(modelName: string, data: FilterQuery<T_DBModel> & T_Enforcement) {
    let startDate: Date = new Date();
    if (data.expireAt) {
      startDate = new Date(data.expireAt);
    }

    return startDate;

    // Additional logic to calculate expiration date based on the model name can be uncommented
  }

  // Asynchronously create a new document in the MongoDB collection
  async create(data: FilterQuery<T_DBModel> & T_Enforcement, options: IOptions = {}): Promise<T_MappedEntity> {
    const expireAt = this.calcExpireDate(this.MongooseModel.modelName, data);
    if (expireAt) {
      data = { ...data, expireAt };
    }
    const newEntity = new this.MongooseModel(data);

    const saveOptions = options?.writeConcern ? { w: options?.writeConcern } : {};

    const saved = await newEntity.save(saveOptions);

    return this.mapEntity(saved);
  }

  // Asynchronously insert multiple documents into the MongoDB collection
  async insertMany(
    data: FilterQuery<T_DBModel> & T_Enforcement[],
    ordered = false
  ): Promise<{ acknowledged: boolean; insertedCount: number; insertedIds: Types.ObjectId[] }> {
    let result;
    try {
      result = await this.MongooseModel.insertMany(data, { ordered });
    } catch (e) {
      throw new DalException(e.message);
    }

    const insertedIds = result.map((inserted) => inserted._id);

    return {
      acknowledged: true,
      insertedCount: result.length,
      insertedIds,
    };
  }

  // Asynchronously update multiple documents in the MongoDB collection
  async update(
    query: FilterQuery<T_DBModel> & T_Enforcement,
    updateBody: UpdateQuery<T_DBModel>
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.MongooseModel.updateMany(query, updateBody, {
      multi: true,
    });

    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  // Asynchronously upsert (update or insert) multiple documents in the MongoDB collection
  async upsertMany(data: (FilterQuery<T_DBModel> & T_Enforcement)[]) {
    const promises = data.map((entry) => this.MongooseModel.findOneAndUpdate(entry, entry, { upsert: true }));

    return await Promise.all(promises);
  }

  // Asynchronously perform bulk write operations on the MongoDB collection
  async bulkWrite(bulkOperations: any, ordered = false): Promise<any> {
    return await this.MongooseModel.bulkWrite(bulkOperations, { ordered });
  }

  // Helper function to map a single entity from data
  protected mapEntity<TData>(data: TData): TData extends null ? null : T_MappedEntity {
    return plainToInstance(this.entity, JSON.parse(JSON.stringify(data))) as any;
  }

  // Helper function to map multiple entities from data
  protected mapEntities(data: any): T_MappedEntity[] {
    return plainToInstance<T_MappedEntity, T_MappedEntity[]>(this.entity, JSON.parse(JSON.stringify(data)));
  }
}

// Interface for specifying write concern options
interface IOptions {
  writeConcern?: number | 'majority';
}