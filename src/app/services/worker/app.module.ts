import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';
import { LoggerModule } from '@infrastructure/logger';
import { GeneralConfigModule } from '@infrastructure/config/impl';

import { TaskProcessor, TaskProcessorImpl } from '@infrastructure/controllers/task/task-processor';

import { TaskModule } from '@di/common/modules/domain/task/task-module';
import { TaskService } from '@domain/task';

import { RequestLoggerModule } from '@di/common/modules/infrastructure/request-logger';
import { RequestLogger } from '@infrastructure/request-logger';

import { ChooseUseCaseStrategyFactoryModule } from '@di/common/modules/infrastructure/choose-use-case-strategy-factory';
import { ChooseUseCaseStrategyFactory } from '@useCases/chooseUseCaseStrategy';

@Module({
    imports: [LoggerModule, GeneralConfigModule, RequestLoggerModule, TaskModule, ChooseUseCaseStrategyFactoryModule],
    providers: [
        {
            provide: Symbols.infrastructure.controllers.TaskProcessor,
            useFactory: (
                requestLogger: RequestLogger,
                taskService: TaskService,
                chooseUseCaseStrategyFactory: ChooseUseCaseStrategyFactory,
            ): TaskProcessor => {
                return new TaskProcessorImpl(
                    requestLogger,
                    taskService,
                    chooseUseCaseStrategyFactory,
                );
            },
            inject: [
                Symbols.infrastructure.loggers.requestLogger,
                Symbols.domain.task.taskService,
                Symbols.infrastructure.strategies.chooseUseCaseStrategy,
            ],
        },
    ],
    exports: [Symbols.infrastructure.controllers.TaskProcessor],
})
export class AppModule {}