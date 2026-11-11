import { FilterQuery, QueryOptions } from 'mongoose';
import * as CoreDomain from '@domain/_core';


export interface Repository<T, E extends CoreDomain.BaseEntity<T>> {
    get(filter: FilterQuery<T>): Promise<E[]>;

    getOne(filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Promise<E | null>;

    getById(id: string): Promise<E | null>;

    getByIds(ids: string[]): Promise<E[]>;

    exists(filter: FilterQuery<T>): Promise<boolean>;
}
