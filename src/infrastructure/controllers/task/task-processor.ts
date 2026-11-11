import { RequestLogger, LogInsertResponse } from '@infrastructure/request-logger';
import { Task, TaskService, TaskState, ChangeTaskStateAdditional, TaskNotFoundError } from '@domain/task';

import {
    ChooseUseCaseStrategyFactory,
    ChooseUseCaseStrategy,
    ChooseUseCaseStrategyParams,
} from '@useCases/chooseUseCaseStrategy';
import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse, UserSubscriptionUseCaseErrorResponse } from '@useCases/processor/common';


export interface TaskProcessor {
    run(taskId: string): Promise<void>;
}


export class TaskProcessorImpl implements TaskProcessor {
    constructor(
        private readonly requestLogger: RequestLogger,
        private readonly taskService: TaskService,
        private readonly chooseUseCaseStrategyFactory: ChooseUseCaseStrategyFactory,
    ) {}

    async run(task_id: string): Promise<void> {
        console.log('[TaskProcessor] Run task_id =', task_id);
        const task: Task = await this.getForProcessing(task_id);

        let logResponse = {} as LogInsertResponse;

        try {
            logResponse = await this.requestLogger.request({
                method: 'task_processor_run',
                data: { task_id },
            });

            const useCaseResponse: UserSubscriptionUseCaseResponse = await this.forwardToUseCase(task);
            console.log('[TaskProcessor] useCaseResponse =', useCaseResponse);

            await this.requestLogger.response({
                request_id: logResponse.request_id,
                response: useCaseResponse,
            });

            if (useCaseResponse.success) {
                await this.taskService.changeState(task, TaskState.Completed, { activationId: useCaseResponse.activationId });
            } else {
                await this.handleUseCaseError(task, useCaseResponse as UserSubscriptionUseCaseErrorResponse);
            }

        } catch (e: any) {
            console.log('[TaskProcessor] catch e =', e);
            await this.requestLogger.error({
                request_id: logResponse.request_id,
                error: e,
            });

            const error = {
                code: e?.code || null,
                message: e?.multiLangMessage?.ru || e?.message || 'Unknown message',
            };

            await this.taskService.changeState(task, TaskState.QueuedForRetrying, { error });
        }
    }

    private async getForProcessing(task_id: string): Promise<Task> {
        const task: Task | null = await this.taskService.getById(task_id);

        if (!task) {
            throw new TaskNotFoundError(task_id);
        }

        return await this.taskService.changeState(task, TaskState.Processing);
    }

    private async forwardToUseCase(task: Task): Promise<UserSubscriptionUseCaseResponse> {
        const chooseStrategyParams: ChooseUseCaseStrategyParams = {
            instruction: task.instruction,
        };

        const strategy: ChooseUseCaseStrategy = this.chooseUseCaseStrategyFactory.chooseStrategy(chooseStrategyParams);

        const useCaseInputParams: UserSubscriptionUseCaseParams = {
            userId: task.userId,
            subscriptionId: task.subscriptionId,
        };

        return await strategy.execute(useCaseInputParams);
    }

    private async handleUseCaseError(task: Task, useCaseResponse: UserSubscriptionUseCaseErrorResponse): Promise<void> {
        const additionalData: ChangeTaskStateAdditional = {
            activationId: useCaseResponse.activationId || null,
            error: useCaseResponse.error || null,
        };

        if (useCaseResponse.shouldRetry) {
            await this.taskService.changeState(task, TaskState.QueuedForRetrying, additionalData);
        } else {
            await this.taskService.changeState(task, TaskState.Error, additionalData);
        }
    }
}