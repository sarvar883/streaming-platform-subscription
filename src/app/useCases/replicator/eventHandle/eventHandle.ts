import { Inject } from '@nestjs/common';
import { Symbols } from '@di/common';

import { EventHandleUseCase } from '@useCases/replicator/eventHandle';
import { EventHandleUseCaseInput } from '@infrastructure/controllers/replicator';
import { TaskService, Task, CreateTaskParams } from '@domain/task';
import { RequestLogger, LogInsertResponse } from '@infrastructure/request-logger';


export class EventHandleUseCaseImpl implements EventHandleUseCase {
    constructor(
        @Inject(Symbols.domain.task.taskService) private readonly taskService: TaskService,
        @Inject(Symbols.infrastructure.loggers.requestLogger) private readonly requestLogger: RequestLogger,
    ) {}

    async execute(params: EventHandleUseCaseInput): Promise<void> {
        let logResponse = {} as LogInsertResponse;

        try {
            logResponse = await this.requestLogger.request({
                method: 'event_received',
                data: params,
            });

            const task_id: string = await this.createTask(params);

            await this.requestLogger.response({
                request_id: logResponse.request_id,
                response: { task_id },
            });

            return;

        } catch (e) {
            await this.requestLogger.error({
                request_id: logResponse.request_id,
                error: e,
            });
        }
    }

    private async createTask(params: EventHandleUseCaseInput): Promise<string> {
        const createTaskParams: CreateTaskParams = {
            userId: params.payload.userId,
            subscriptionId: params.payload.subscriptionId,
            instruction: params.instruction,
        };

        const task: Task = await this.taskService.create(createTaskParams);

        return task.id;
    }
}