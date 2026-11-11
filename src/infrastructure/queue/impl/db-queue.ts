import { Queue } from '@infrastructure/queue';

import { Task, TaskState, TaskService } from '@domain/task';

export class DbQueueImpl implements Queue {
    constructor(
        private readonly taskService: TaskService,
    ) {}

    async dequeue(): Promise<Task | null> {
        let task: Task | null = await this.taskService.getNext();

        if (task) {
            task.attempts = task.attempts + 1;
            task = await this.taskService.changeState(task, TaskState.QueuedForProcessing);
        }

        return task;
    }

    async size(): Promise<number> {
        return await this.taskService.count();
    }
}