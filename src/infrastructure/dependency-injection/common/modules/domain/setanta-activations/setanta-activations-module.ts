import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

import { EntityModel } from '@data/impl/mongo';

import { StateHistoryModule } from '@di/common/modules/domain/state-history/state-history-module';
import { StateHistoryService } from '@domain/state-history';

import { SetantaDbModule } from '@di/common/modules/infrastructure/db-modules';
import { SetantaActivationsRepositoryImpl } from '@data/impl/mongo/repositories';

import {
    SetantaActivationsService,
    SetantaActivationsServiceImpl,
    SetantaActivationsRepository,
    SetantaActivationModel,
} from '@domain/setanta-activations';

@Module({
    imports: [SetantaDbModule, StateHistoryModule],
    providers: [
        {
            provide: Symbols.domain.setantaActivations.activationsService,
            useFactory: (
                stateHistoryService: StateHistoryService,
                setantaActivationsRepository: SetantaActivationsRepository,
            ): SetantaActivationsService => {
                return new SetantaActivationsServiceImpl(stateHistoryService, setantaActivationsRepository);
            },
            inject: [
                Symbols.domain.stateHistory.stateHistoryService,
                Symbols.domain.setantaActivations.activationsRepository,
            ],
        },
        {
            provide: Symbols.domain.setantaActivations.activationsRepository,
            useFactory: (entityModel: EntityModel<SetantaActivationModel>): SetantaActivationsRepository => {
                return new SetantaActivationsRepositoryImpl(entityModel);
            },
            inject: [Symbols.domain.setantaActivations.activationsSchema],
        },
    ],
    exports: [Symbols.domain.setantaActivations.activationsService, Symbols.domain.setantaActivations.activationsRepository],
})
export class SetantaActivationsModule {}