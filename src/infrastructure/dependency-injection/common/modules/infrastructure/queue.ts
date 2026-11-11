import { Module } from '@nestjs/common';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { Symbols } from '@di/common/symbols';

import { SetantaDbModule } from '@di/common/modules/infrastructure/db-modules';
import { TaskService } from '@domain/task';
import { TaskModule } from '@di/common/modules/domain/task/task-module';
import { Queue, DbQueueImpl } from '@infrastructure/queue';

@Module({
    imports: [SetantaDbModule, TaskModule],
    providers: [
        {
            provide: Symbols.infrastructure.queue.DbQueue,
            useFactory: (taskService: TaskService): Queue => {
                return new DbQueueImpl(taskService);
            },
            inject: [Symbols.domain.task.taskService],
        },
    ],
    exports: [Symbols.infrastructure.queue.DbQueue],
})
export class QueueModule {}