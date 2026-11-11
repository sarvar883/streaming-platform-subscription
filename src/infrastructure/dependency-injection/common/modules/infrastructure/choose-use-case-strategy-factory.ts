import { Module } from '@nestjs/common';
import { Symbols } from '@di/common/symbols';
import { ChooseUseCaseStrategyFactory, ChooseUseCaseStrategyFactoryImpl } from '@useCases/chooseUseCaseStrategy';
import { UseCasesModule } from '@di/common/modules/domain/usecases-module/usecases-module';
import { SubscriptionActivateUseCase } from '@useCases/processor/subscriptionActivate';
import { SubscriptionCancelUseCase } from '@useCases/processor/subscriptionCancel';

@Module({
    imports: [UseCasesModule],
    providers: [
        {
            provide: Symbols.infrastructure.strategies.chooseUseCaseStrategy,
            useFactory: (
                subscriptionActivateUseCase: SubscriptionActivateUseCase,
                subscriptionCancelUseCase: SubscriptionCancelUseCase,
            ): ChooseUseCaseStrategyFactory => {
                return new ChooseUseCaseStrategyFactoryImpl(subscriptionActivateUseCase, subscriptionCancelUseCase);
            },
            inject: [Symbols.useCases.SubscriptionActivate, Symbols.useCases.SubscriptionCancel],
        }
    ],
    exports: [Symbols.infrastructure.strategies.chooseUseCaseStrategy],
})
export class ChooseUseCaseStrategyFactoryModule {}