import { OnModuleInit } from '@nestjs/common';
import { Logger } from '@payme/logger';
import { Milliseconds } from '@domain/_core';
import { sleep } from '@domain/utils/sleep';

import { ProcessorConfigs } from '@infrastructure/controllers/processor';
import { WorkerPool } from '@infrastructure/worker-pool';
import { Queue, QueueFullError } from '@infrastructure/queue';
import { Task } from '@domain/task';
import { TaskRecoveryService } from '@infrastructure/task-recovery';
import { ConflictingTasksResolver } from '@infrastructure/conflicting-tasks-resolver';

export class Processor implements OnModuleInit {
    constructor(
        private readonly logger: Logger,
        private readonly config: ProcessorConfigs,
        private readonly workerPool: WorkerPool,
        private readonly queue: Queue,
        private readonly taskRecoveryService: TaskRecoveryService,
        private readonly conflictingTasksResolver: ConflictingTasksResolver,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.run();
    }

    private async run() {
        console.log('[Processor] run');
        await this.taskRecoveryService.execute();

        while (true) {
            console.log('[Processor] iteration');
            let sleepTime: Milliseconds = this.config.sleepTimeBetweenTasks;

            await this.conflictingTasksResolver.resolveConflictingTasks();

            if (this.workerPool.acceptsTasks()) {
                this.logger.info('[Processor] Task processing is active');

                const task: Task | null = await this.queue.dequeue();

                if (task) {
                    const task_id: string = task.id;

                    this.logger.info(`[Processor] Processing task ${task_id}`);
                    this.runNext(task_id);

                } else {
                    this.logger.info('[Processor] No tasks in the queue');
                    sleepTime = this.config.sleepTimeOnEmptyQueue;
                }

            } else {
                this.logger.info('[Processor] Task processing is paused');
                sleepTime = this.config.sleepTimeOnFullQueue;
            }

            await sleep(sleepTime);
        }
    }

    private runNext(task_id: string): void {
        this.workerPool.run(task_id).catch(async (e) => {
            console.log('[Processor] Error on running task ' + task_id);

            if (e instanceof QueueFullError) {
                await sleep(this.config.sleepTimeOnFullQueue);
                this.runNext(task_id);

            } else {
                this.logger.error(`[Processor.runNext] Error, task_id=${task_id}`);
                console.log(`[Processor.runNext] Error, task_id=${task_id}`);
            }
        });
    }
}