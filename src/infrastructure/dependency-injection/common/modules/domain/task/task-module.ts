import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig, GeneralConfigModule } from '@infrastructure/config/impl';
import { EntityModel } from '@data/impl/mongo';

import { StateHistoryModule } from '@di/common/modules/domain/state-history/state-history-module';
import { StateHistoryService } from '@domain/state-history';

import { SetantaDbModule } from '@di/common/modules/infrastructure/db-modules';

import { TaskRepositoryImpl } from '@data/impl/mongo/repositories/task';
import { TaskService, TaskServiceImpl, TaskServiceConfig, TaskRepository, TaskModel } from '@domain/task';

@Module({
    imports: [GeneralConfigModule, SetantaDbModule, StateHistoryModule],
    providers: [
        {
            provide: Symbols.domain.task.taskService,
            useFactory: (
                stateHistoryService: StateHistoryService,
                config: ConfigContainer<GeneralConfig>,
                taskRepository: TaskRepository,
            ): TaskService => {
                const taskServiceConfig: TaskServiceConfig = {
                    debounceTimeAfterCreate: config.get('taskService.debounceTimeAfterCreate'),
                    debounceTimeForRetry: config.get('taskService.debounceTimeForRetry'),
                };

                return new TaskServiceImpl(stateHistoryService, taskServiceConfig, taskRepository);
            },
            inject: [
                Symbols.domain.stateHistory.stateHistoryService,
                Symbols.infrastructure.config.general,
                Symbols.domain.task.taskRepository,
            ],
        },
        {
            provide: Symbols.domain.task.taskRepository,
            useFactory: (entityModel: EntityModel<TaskModel>): TaskRepository => {
                return new TaskRepositoryImpl(entityModel);
            },
            inject: [Symbols.domain.task.taskSchema],
        },
    ],
    exports: [Symbols.domain.task.taskService, Symbols.domain.task.taskRepository],
})
export class TaskModule {}