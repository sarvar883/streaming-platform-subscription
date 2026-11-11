import { Module } from '@nestjs/common';
import { Symbols } from '@di/common/symbols';
import { TaskRecoveryService, TaskRecoveryServiceImpl } from '@infrastructure/task-recovery';

import { TaskModule } from '@di/common/modules/domain/task/task-module';
import { TaskService } from '@domain/task';

@Module({
    imports: [TaskModule],
    providers: [
        {
            provide: Symbols.infrastructure.taskRecovery.taskRecoveryService,
            useFactory: (taskService: TaskService): TaskRecoveryService => {
                return new TaskRecoveryServiceImpl(taskService);
            },
            inject: [Symbols.domain.task.taskService],
        },
    ],
    exports: [Symbols.infrastructure.taskRecovery.taskRecoveryService],
})
export class TaskRecoveryModule {}