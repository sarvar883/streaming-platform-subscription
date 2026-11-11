import { BaseService, Milliseconds } from '@domain/_core';
import { Stateful, StateHistoryService } from '@domain/state-history';
import { DateUtils } from '@domain/utils/date';

import {
    Task,
    TaskRepository,
    TaskServiceConfig,
    TaskState,
    taskRules,
    CreateTaskParams,
    ChangeTaskStateAdditional,
} from '@domain/task';


export interface TaskService extends Stateful<Task, TaskState, CreateTaskParams> {
    getById(id: string): Promise<Task | null>;
    create(params: CreateTaskParams): Promise<Task>;
    changeState(task: Task, state: TaskState, additionalData?: ChangeTaskStateAdditional): Promise<Task>;
    getCurrentTasks(): Promise<Task[]>;
    getNext(): Promise<Task | null>;
    getForRecovery(offset?: number, limit?: number): Promise<Task[]>;
    getForProcessing(taskId: string): Promise<Task>;
    count(): Promise<number>;
}


Stateful.registerRules<TaskState>('task', taskRules);
@Stateful.register
export class TaskServiceImpl extends BaseService implements TaskService {
    private readonly debounceTimeAfterCreate: Milliseconds;
    private readonly debounceTimeForRetry: Milliseconds;

    constructor(
        private readonly stateHistoryService: StateHistoryService,
        private readonly config: TaskServiceConfig,
        private readonly taskRepository: TaskRepository,
    ) {
        super('task');
        this.debounceTimeAfterCreate = config.debounceTimeAfterCreate;
        this.debounceTimeForRetry = config.debounceTimeForRetry;
    }

    async getById(id: string): Promise<Task | null> {
        return await this.taskRepository.getById(id);
    }

    async create(params: CreateTaskParams): Promise<Task> {
        const date: Date = new Date();

        const processTime: Date = DateUtils.addMsToDate(date, this.debounceTimeAfterCreate);

        let task: Task = new Task({
            userId: params.userId,
            subscriptionId: params.subscriptionId,
            instruction: params.instruction,
            state: TaskState.Created,
            createdAt: date,
            processTime,
            locked: false,
        });

        task = await this.taskRepository.create(task);

        return task;
    }

    async changeState(task: Task, state: TaskState, additionalData?: ChangeTaskStateAdditional): Promise<Task> {
        task.state = state;

        if (additionalData?.activationId?.length > 0) {
            task.activationId = additionalData?.activationId;
        }

        if (state === TaskState.Completed) {
            task.completedAt = new Date();
        }

        if (state === TaskState.QueuedForRetrying) {
            task.processTime = DateUtils.addMsToDate(task.processTime, this.debounceTimeForRetry);
            task.error = additionalData?.error || null;
        }

        if (state === TaskState.Error) {
            task.error = additionalData?.error || null;
            task.erroredAt = new Date();
        }

        if (state === TaskState.Redundant && additionalData?.conflictingTaskId) {
            task.conflictingTaskId = additionalData.conflictingTaskId;
        }

        task.unlock();

        return await this.taskRepository.save(task);
    }

    async getCurrentTasks(): Promise<Task[]> {
        const states = [TaskState.Created];

        return await this.taskRepository.getCurrentTasks(states);
    }

    async getNext(): Promise<Task | null> {
        const states = [
            TaskState.Created,
            TaskState.QueuedForRetrying,
        ];

        return await this.taskRepository.getNext(states);
    }

    async getForRecovery(offset?: number, limit?: number): Promise<Task[]> {
        const states = [
            TaskState.QueuedForProcessing,
            TaskState.Processing,
        ];

        return await this.taskRepository.getByStates(states, offset, limit);
    }

    async getForProcessing(task_id: string): Promise<Task> {
        let task = await this.taskRepository.getById(task_id);

        task = await this.changeState(task, TaskState.Processing);

        return task;
    }

    async count(): Promise<number> {
        return await this.taskRepository.count();
    }
}