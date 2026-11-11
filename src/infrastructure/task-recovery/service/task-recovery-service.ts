import { Task, TaskService, TaskState } from '@domain/task';

export interface TaskRecoveryService {
    recoverTasks(tasks: Task[]): Promise<void>;
    execute(): Promise<void>;
}

export class TaskRecoveryServiceImpl implements TaskRecoveryService {
    constructor(
        private readonly taskService: TaskService,
    ) {}

    async execute(): Promise<void> {
        console.log('[TaskRecovery] execute');
        const tasks: Task[] = await this.taskService.getForRecovery();

        if (tasks && tasks.length > 0) {
            await this.recoverTasks(tasks);
        }

        console.log('[TaskRecovery] all tasks have been processed');
    }

    async recoverTasks(tasks: Task[]): Promise<void> {
        for (let i = 0; i < tasks.length; i++) {
            let currentTask: Task = tasks[i];

            try {
                await this.taskService.changeState(currentTask, TaskState.QueuedForRetrying);
            } catch (e) {
                console.log('[TaskRecovery] recoverTasks error for task_id =', currentTask.id);
                console.log('[TaskRecovery] recoverTasks catch error =', e);
            }
        }
    }
}