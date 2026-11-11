import { ChooseUseCaseStrategy, ChooseUseCaseStrategyParams } from '@useCases/chooseUseCaseStrategy';
import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse } from '@useCases/processor/common';
import { SubscriptionCancelUseCase } from '@useCases/processor/subscriptionCancel';
import { Instruction } from '@domain/task';

export class SubscriptionCancelStrategy implements ChooseUseCaseStrategy {
    constructor(
        private readonly subscriptionCancelUseCase: SubscriptionCancelUseCase,
    ) {}

    match(params: ChooseUseCaseStrategyParams): boolean {
        return params.instruction === Instruction.Off;
    }

    async execute(params: UserSubscriptionUseCaseParams): Promise<UserSubscriptionUseCaseResponse> {
        return await this.subscriptionCancelUseCase.execute(params);
    }
}