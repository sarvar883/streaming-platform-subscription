import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

import { EntityModel } from '@data/impl/mongo';
import { SetantaDbModule } from '@di/common/modules/infrastructure/db-modules';
import { StateHistoryService, StateHistoryServiceImpl, StateHistoryRepository, StateHistoryModel } from '@domain/state-history';
import { StateHistoryRepositoryImpl } from '@data/impl/mongo/repositories/state-history';

@Module({
    imports: [SetantaDbModule],
    providers: [
        {
            provide: Symbols.domain.stateHistory.stateHistoryService,
            useFactory: (stateHistoryRepository: StateHistoryRepository): StateHistoryService => {
                return new StateHistoryServiceImpl(stateHistoryRepository);
            },
            inject: [Symbols.domain.stateHistory.stateHistoryRepository],
        },
        {
            provide: Symbols.domain.stateHistory.stateHistoryRepository,
            useFactory: (entityModel: EntityModel<StateHistoryModel>): StateHistoryRepository => {
                return new StateHistoryRepositoryImpl(entityModel);
            },
            inject: [Symbols.domain.stateHistory.stateHistorySchema],
        },
    ],
    exports: [Symbols.domain.stateHistory.stateHistoryService, Symbols.domain.stateHistory.stateHistoryRepository],
})
export class StateHistoryModule {}