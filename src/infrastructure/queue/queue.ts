import { Task, TaskState } from '@domain/task';

export interface Queue {
    dequeue(): Promise<Task | null>;
    size(): Promise<number>;
}