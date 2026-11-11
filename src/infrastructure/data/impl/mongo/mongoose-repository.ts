import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { BaseEntity, SortValues } from '@domain/_core';
import { AsyncIterableIteratorWrapper, MongooseQueryCursorWrapper, Repository } from '@data/impl/mongo';
import { IdentifierToString, NoOverlap, RequiredFieldsOnly } from '@domain/utils/type-helpers';

export type EntityModel<T> = Model<T>;

type EntityClass<T, E> = {
    new (data?: NoOverlap<RequiredFieldsOnly<IdentifierToString<T>>>): E;
};


export class MongooseRepository<T, E extends BaseEntity<T>> implements Repository<T, E> {
    protected entity!: EntityClass<T, E>;
    private _model!: EntityModel<T>;

    protected get model(): EntityModel<T> {
        return this._model;
    }

    private set model(model: EntityModel<T>) {
        this._model = model;
    }

    constructor(entityModel: EntityModel<T>, private readonly entityClass: EntityClass<T, E>) {
        this.model = entityModel;
        this.entity = entityClass;
    }

    async create(entity: E): Promise<E> {
        Object.defineProperty(entity, 'model', { enumerable: false, value: new this.model() });
        if ((entity as any).create_data) {
            Object.assign((entity as any).model, (entity as any).create_data);
        }
        return this.save(entity);
    }

    private async toEntity(result: Promise<any | null>): Promise<E | null> {
        const doc = await result;
        if (!doc) return null;
        const entity = new this.entity();
        Object.defineProperty(entity, 'model', { enumerable: false, value: doc });
        return entity;
    }

    private async toEntities(results: Promise<any[]>): Promise<E[]> {
        return (await results).map<E>((doc) => {
            const entity = new this.entity();
            Object.defineProperty(entity, 'model', { enumerable: false, value: doc });
            return entity;
        });
    }

    async save(entity: E): Promise<E> {
        return (await this.toEntity((entity as any).model.save())) as unknown as E;
    }

    async insertMany(entities: E[]): Promise<E[]> {
        const mapped = entities.map((entity) => entity.toJSON());
        return (await this.toEntities(this.model.insertMany(mapped, { ordered: false }))) as unknown as E[];
    }

    async delete(entity: E): Promise<void> {
        await this.model.deleteOne().where('_id', entity.id);
    }

    async getAllSorted(sort: Partial<Record<keyof T, SortValues>>, skip: number, limit: number): Promise<E[]> {
        return this.toEntities(this.model.find().sort(sort).skip(skip).limit(limit).exec());
    }

    async getByQuery(query: any, skip: number, limit: number, sort: Partial<Record<keyof T, SortValues>>): Promise<E[]> {
        return this.toEntities(this.model.find(query).sort(sort).skip(skip).limit(limit).exec());
    }

    async getByQueryCount(query: any): Promise<number> {
        return this.model.countDocuments(query).exec();
    }

    getCursor(query: any, sort: Partial<Record<keyof T, SortValues>>, limit?: number) {
        if (limit) {
            return this.model.find(query).sort(sort).limit(limit).cursor();
        } else {
            return this.model.find(query).sort(sort).cursor();
        }
    }

    getAsyncIterable(query: any, sort: Partial<Record<keyof T, SortValues>>, limit?: number): AsyncIterableIteratorWrapper<E> {
        const cursor = this.getCursor(query, sort, limit);
        const mutatedCursor = cursor.map<E>((doc): E => {
            const entity = new this.entity();
            Object.defineProperty(entity, 'model', { enumerable: false, value: doc });
            return entity;
        });

        return new MongooseQueryCursorWrapper(mutatedCursor);
    }

    createEmpty(): E {
        const entity = new this.entity();
        Object.defineProperty(entity, 'model', { enumerable: false, value: new this.model() });
        return entity;
    }

    async getSorted(filter: any, sort?: Partial<Record<keyof T, SortValues>>, limit?: number, skip?: number): Promise<E[]> {
        return this.toEntities(
            this.model
                .find(filter)
                .sort(sort)
                .limit(limit ? limit : 0)
                .skip(skip ? skip : 0)
                .exec()
        );
    }

    async getInWhere(array: any[], where: string): Promise<E[]> {
        return this.toEntities(this.model.find().where(where).in(array).exec());
    }

    async get(filter: any): Promise<E[]> {
        return this.toEntities(this.model.find(filter).exec());
    }

    async getOne(filter: any): Promise<E | null> {
        return this.toEntity(this.model.findOne(filter).exec());
    }

    async getOneAndUpdate(filter: any, update: any, options: QueryOptions): Promise<E> {
        return this.toEntity(this.model.findOneAndUpdate(filter, update, { ...options, ...{ new: true } }).exec());
    }

    async getById(id: string): Promise<E | null> {
        return this.toEntity(this.model.findById(id).exec());
    }

    async getByIds(ids: string[]): Promise<E[]> {
        return this.toEntities(this.model.find().where('_id').in(ids).exec());
    }

    async getAll(): Promise<E[]> {
        return this.toEntities(this.model.find().exec());
    }

    async remove(filter: any): Promise<void> {
        await this.model.deleteOne(filter);
    }

    async removeMany(filter: any): Promise<void> {
        await this.model.deleteMany(filter);
    }

    async removeById(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async removeByIdList(ids: string[]): Promise<void> {
        await this.model.deleteMany().where('_id').in(ids);
    }

    async updateOne(filter: any, update: UpdateQuery<T>): Promise<E | null> {
        return this.toEntity(this.model.findOneAndUpdate(filter, update).exec());
    }

    async updateByIdList(ids: string[], update: UpdateQuery<T>): Promise<void> {
        const objectIds = ids.map((id) => new Types.ObjectId(id));

        await this.model.updateMany({ _id: { $in: objectIds } as any }, update);
    }

    async exists(filter: any): Promise<boolean> {
        return !!(await this.model.exists(filter).exec());
    }
}