import { EntityModel, MongooseRepository } from '@data/impl/mongo';
import { SortValues } from '@domain/_core';
import { TaskRepository, Task, TaskModel, TaskState } from '@domain/task';


export class TaskRepositoryImpl extends MongooseRepository<TaskModel, Task> implements TaskRepository {
    constructor(
        private readonly entityModel: EntityModel<TaskModel>
    ) {
        super(entityModel, Task);
    }

    async updateTask(task_id: string, update: Record<string, any>): Promise<void> {
        await this.updateOne({ _id: task_id }, update);
    }

    async getByStates(states: TaskState[], offset: number, limit: number): Promise<Task[]> {
        const query = {
            state: { $in: states },
        };

        const sort = {
            createdAt: SortValues.ASC,
        };

        return await this.getByQuery(query, offset, limit, sort);
    }

    async getCurrentTasks(states: TaskState[]): Promise<Task[]> {
        const currentDate = new Date();

        const query = {
            state: { $in: states },
            locked: false,
            processTime: { $lt: currentDate },
        };

        return await this.get(query);
    }

    async getNext(states: TaskState[]): Promise<Task | null> {
        const currentDate = new Date();

        const query = {
            state: { $in: states },
            locked: false,
            processTime: { $lt: currentDate },
        };

        const update = {
            locked: true,
            lockedAt: currentDate,
        };

        const options = {
            sort: {
                createdAt: SortValues.ASC,
            },
        };

        return await super.getOneAndUpdate(query, update, options);
    }

    async count(): Promise<number> {
        const query = {
            state: TaskState.Created,
        };

        return await this.getByQueryCount(query);
    }
}