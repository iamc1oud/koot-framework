import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectId,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { Entity } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T_Entity> {
  public _model: ClassConstructor<T_Entity>;

  constructor(
    protected entity: ClassConstructor<T_Entity>,
    private repository: Repository<T_Entity>,
  ) {
    this._model = entity;
  }

  async create(
    data: DeepPartial<T_Entity>,
    options: SaveOptions = {},
  ): Promise<T_Entity> {
    console.log('Entity saving in database: ', data);
    const newEntity = this.repository.create(data);

    const saved = await this.repository.save(newEntity);

    return this.mapEntity(saved);
  }

  async save(entity: T_Entity): Promise<T_Entity> {
    return this.repository.save(entity);
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T_Entity>,
    partialEntity: QueryDeepPartialEntity<T_Entity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  mapEntity(entity: T_Entity): T_Entity {
    return plainToInstance(this.entity, JSON.parse(JSON.stringify(entity)));
  }
}
