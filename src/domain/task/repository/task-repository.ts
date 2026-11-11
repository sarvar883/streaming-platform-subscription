import { Task, TaskState } from '@domain/task';

export interface TaskRepository {
    save(task: Task): Promise<Task>;

    create(data: Task): Promise<Task>;

    getById(id: string): Promise<Task>;

    updateTask(task_id: string, update: Record<string, any>): Promise<void>;

    getByStates(states: TaskState[], offset?: number, limit?: number): Promise<Task[]>;

    getCurrentTasks(states: TaskState[]): Promise<Task[]>;

    getNext(states: TaskState[]): Promise<Task | null>;

    count(): Promise<number>;
}