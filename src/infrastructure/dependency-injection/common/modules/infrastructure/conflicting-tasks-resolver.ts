import { Module } from '@nestjs/common';
import { Symbols } from '@di/common/symbols';
import { ConflictingTasksResolver, ConflictingTasksResolverImpl } from '@infrastructure/conflicting-tasks-resolver';

import { TaskModule } from '@di/common/modules/domain/task/task-module';
import { TaskService } from '@domain/task';

@Module({
    imports: [TaskModule],
    providers: [{
        provide: Symbols.infrastructure.conflictingTasksResolver.service,
        useFactory: (taskService: TaskService): ConflictingTasksResolver => {
            return new ConflictingTasksResolverImpl(taskService);
        },
        inject: [Symbols.domain.task.taskService],
    }],
    exports: [Symbols.infrastructure.conflictingTasksResolver.service],
})
export class ConflictingTasksResolverModule {}