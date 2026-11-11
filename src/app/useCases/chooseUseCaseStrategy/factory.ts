import {
    ChooseUseCaseStrategy,
    ChooseUseCaseStrategyParams,
    SubscriptionActivateStrategy,
    SubscriptionCancelStrategy,
    UseCaseNotFoundError,
} from '@useCases/chooseUseCaseStrategy';
import { SubscriptionActivateUseCase } from '@useCases/processor/subscriptionActivate';
import { SubscriptionCancelUseCase } from '@useCases/processor/subscriptionCancel';

export interface ChooseUseCaseStrategyFactory {
    chooseStrategy(params: ChooseUseCaseStrategyParams): ChooseUseCaseStrategy;
}

export class ChooseUseCaseStrategyFactoryImpl implements ChooseUseCaseStrategyFactory {
    private readonly strategies: ChooseUseCaseStrategy[];

    constructor(
        private readonly subscriptionActivateUseCase: SubscriptionActivateUseCase,
        private readonly subscriptionCancelUseCase: SubscriptionCancelUseCase,
    ) {
        this.strategies = [
            new SubscriptionActivateStrategy(subscriptionActivateUseCase),
            new SubscriptionCancelStrategy(subscriptionCancelUseCase),
        ];
    }

    chooseStrategy(params: ChooseUseCaseStrategyParams): ChooseUseCaseStrategy {
        const strategy: ChooseUseCaseStrategy = this.strategies.find(strategy => strategy.match(params));

        if (!strategy) {
            throw new UseCaseNotFoundError();
        }

        return strategy;
    }
}