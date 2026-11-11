import { EntityModel, MongooseRepository } from '@data/impl/mongo';

import {
    StateHistory,
    StateHistoryModel,
    StateOfState,
    StateHistoryRepository,
} from '@domain/state-history';


export class StateHistoryRepositoryImpl extends MongooseRepository<StateHistoryModel, StateHistory> implements StateHistoryRepository {
    constructor(
        private readonly entityModel: EntityModel<StateHistoryModel>
    ) {
        super(entityModel, StateHistory);
    }

    async getCurrentStateLogByObjectId(objectId: string): Promise<StateHistory> {
        return super.getOne({ objectId: objectId, state: 'active' as StateOfState });
    }
}