import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

// import UseCases
import { EventHandleUseCase, EventHandleUseCaseImpl } from '@useCases/replicator/eventHandle';
import { SubscriptionActivateUseCase, SubscriptionActivateUseCaseImpl } from '@useCases/processor/subscriptionActivate';
import { SubscriptionCancelUseCase, SubscriptionCancelUseCaseImpl } from '@useCases/processor/subscriptionCancel';

// import modules
import { TaskModule } from '@di/common/modules/domain/task/task-module';
import { TaskService } from '@domain/task';

import { RequestLoggerModule } from '@di/common/modules/infrastructure/request-logger';
import { RequestLogger } from '@infrastructure/request-logger';

import { PaymeUsersModule } from '@di/common/modules/domain/payme-users/payme-users-module';
import { PaymeUsersService } from '@domain/payme-users';

import { SetantaUsersModule } from '@di/common/modules/domain/setanta-users/setanta-users-module';
import { SetantaUsersService } from '@domain/setanta-users';

import { SetantaActivationsModule } from '@di/common/modules/domain/setanta-activations/setanta-activations-module';
import { SetantaActivationsService } from '@domain/setanta-activations';

import { SetantaModule } from '@di/common/modules/domain/setanta/setanta-module';
import { SetantaService } from '@domain/setanta';

import { KafkaModule } from '@di/common/modules/infrastructure/kafka';
import { EventProducer } from '@domain/_core';

@Module({
    imports: [
        TaskModule,
        RequestLoggerModule,
        PaymeUsersModule,
        SetantaUsersModule,
        SetantaActivationsModule,
        SetantaModule,
        KafkaModule,
    ],
    providers: [
        {
            provide: Symbols.useCases.EventHandle,
            useFactory: (taskService: TaskService, requestLogger: RequestLogger): EventHandleUseCase => {
                return new EventHandleUseCaseImpl(taskService, requestLogger);
            },
            inject: [Symbols.domain.task.taskService, Symbols.infrastructure.loggers.requestLogger],
        },
        {
            provide: Symbols.useCases.SubscriptionActivate,
            useFactory: (
                paymeUsersService: PaymeUsersService,
                setantaUsersService: SetantaUsersService,
                setantaActivationsService: SetantaActivationsService,
                setantaService: SetantaService,
                producer: EventProducer,
            ): SubscriptionActivateUseCase => {
                return new SubscriptionActivateUseCaseImpl(
                    paymeUsersService,
                    setantaUsersService,
                    setantaActivationsService,
                    setantaService,
                    producer,
                );
            },
            inject: [
                Symbols.domain.paymeUsers.paymeUsersService,
                Symbols.domain.setantaUsers.setantaUsersService,
                Symbols.domain.setantaActivations.activationsService,
                Symbols.domain.setantaService.setantaService,
                Symbols.infrastructure.kafka.kafkaProducer,
            ],
        },
        {
            provide: Symbols.useCases.SubscriptionCancel,
            useFactory: (
                paymeUsersService: PaymeUsersService,
                setantaUsersService: SetantaUsersService,
                setantaActivationsService: SetantaActivationsService,
                setantaService: SetantaService,
                producer: EventProducer,
            ): SubscriptionCancelUseCase => {
                return new SubscriptionCancelUseCaseImpl(
                    paymeUsersService,
                    setantaUsersService,
                    setantaActivationsService,
                    setantaService,
                    producer,
                );
            },
            inject: [
                Symbols.domain.paymeUsers.paymeUsersService,
                Symbols.domain.setantaUsers.setantaUsersService,
                Symbols.domain.setantaActivations.activationsService,
                Symbols.domain.setantaService.setantaService,
                Symbols.infrastructure.kafka.kafkaProducer,
            ],
        },
    ],
    exports: [
        Symbols.useCases.EventHandle,
        Symbols.useCases.SubscriptionActivate,
        Symbols.useCases.SubscriptionCancel,
    ],
})
export class UseCasesModule {}