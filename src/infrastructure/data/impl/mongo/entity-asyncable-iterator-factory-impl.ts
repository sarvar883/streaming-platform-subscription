import * as Mongoose from 'mongoose';

export class AsyncIterableIteratorWrapper<T> implements AsyncIterableIterator<T> {
    constructor(public readonly next: AsyncIterator<T, any, undefined>['next']) {}

    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        return this;
    }

    static done(): IteratorReturnResult<undefined> {
        return {
            done: true,
            value: undefined,
        };
    }

    static returnNext<TReturn>(value: TReturn): IteratorYieldResult<TReturn> {
        return {
            done: false,
            value: value,
        };
    }
}

export class MongooseQueryCursorWrapper<T> extends AsyncIterableIteratorWrapper<T> {
    // @ts-ignore
    constructor(public readonly iterator: Mongoose.QueryCursor<T>) {
        super(async () => {
            const item = await iterator.next();
            if (item) {
                return AsyncIterableIteratorWrapper.returnNext(item);
            } else {
                return AsyncIterableIteratorWrapper.done();
            }
        });
    }
}
