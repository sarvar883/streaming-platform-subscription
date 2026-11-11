import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';

import { GeneralConfigModule } from '@infrastructure/config/impl';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig } from '@infrastructure/config/impl';

import { Processor, ProcessorConfigs } from '@infrastructure/controllers/processor';
import { WorkerPool } from '@infrastructure/worker-pool';
import { WorkerPoolModule } from '@di/common/modules/infrastructure/worker-pool';
import { Queue } from '@infrastructure/queue';
import { QueueModule } from '@di/common/modules/infrastructure/queue';

import { TaskRecoveryModule } from '@di/common/modules/infrastructure/task-recovery-module';
import { TaskRecoveryService } from '@infrastructure/task-recovery';

import { ConflictingTasksResolverModule } from '@di/common/modules/infrastructure/conflicting-tasks-resolver';
import { ConflictingTasksResolver } from '@infrastructure/conflicting-tasks-resolver';

@Module({
    imports: [GeneralConfigModule, WorkerPoolModule, QueueModule, TaskRecoveryModule, ConflictingTasksResolverModule],
    providers: [
        {
            provide: Symbols.infrastructure.controllers.Processor,
            useFactory: (
                logger: Logger,
                config: ConfigContainer<GeneralConfig>,
                workerPool: WorkerPool,
                queue: Queue,
                taskRecoveryService: TaskRecoveryService,
                conflictingTasksResolver: ConflictingTasksResolver,
            ) => {
                const processorConfigs: ProcessorConfigs = {
                    sleepTimeBetweenTasks: config.get('processor.sleepTimeBetweenTasks'),
                    sleepTimeOnFullQueue: config.get('processor.sleepTimeOnFullQueue'),
                    sleepTimeOnEmptyQueue: config.get('processor.sleepTimeOnEmptyQueue'),
                };

                return new Processor(logger, processorConfigs, workerPool, queue, taskRecoveryService, conflictingTasksResolver);
            },
            inject: [
                Tokens.Logger,
                Symbols.infrastructure.config.general,
                Symbols.infrastructure.worker.WorkerPool,
                Symbols.infrastructure.queue.DbQueue,
                Symbols.infrastructure.taskRecovery.taskRecoveryService,
                Symbols.infrastructure.conflictingTasksResolver.service,
            ],
        },
    ],
    exports: [Symbols.infrastructure.controllers.Processor],
})
export class AppModule {}