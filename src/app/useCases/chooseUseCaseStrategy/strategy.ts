import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse } from '@useCases/processor/common';
import { Instruction } from '@domain/task';

export type ChooseUseCaseStrategyParams = {
    instruction: Instruction;
}

export interface ChooseUseCaseStrategy {
    match(params: ChooseUseCaseStrategyParams): boolean;
    execute(params: UserSubscriptionUseCaseParams): Promise<UserSubscriptionUseCaseResponse>;
}