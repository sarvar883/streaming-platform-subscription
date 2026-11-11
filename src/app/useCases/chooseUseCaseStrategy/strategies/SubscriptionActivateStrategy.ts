import { ChooseUseCaseStrategy, ChooseUseCaseStrategyParams } from '@useCases/chooseUseCaseStrategy';
import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse } from '@useCases/processor/common';
import { SubscriptionActivateUseCase } from '@useCases/processor/subscriptionActivate';
import { Instruction } from '@domain/task';

export class SubscriptionActivateStrategy implements ChooseUseCaseStrategy {
    constructor(
        private readonly subscriptionActivateUseCase: SubscriptionActivateUseCase,
    ) {}

    match(params: ChooseUseCaseStrategyParams): boolean {
        return params.instruction === Instruction.On;
    }

    async execute(params: UserSubscriptionUseCaseParams): Promise<UserSubscriptionUseCaseResponse> {
        return await this.subscriptionActivateUseCase.execute(params);
    }
}