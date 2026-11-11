import { EntityType } from '@domain/_core';
import { StateHistory, StateHistoryRepository } from '@domain/state-history';

export interface StateHistoryService {
    recordStateChange(objectId: string, entity: EntityType, newState: string): Promise<StateHistory>;
}

export class StateHistoryServiceImpl implements StateHistoryService {
    constructor(
        private readonly stateHistoryRepository: StateHistoryRepository,
    ) {}

    private async inactivateStateLog(stateHistory: StateHistory): Promise<StateHistory> {
        if (stateHistory.state === 'active') {
            stateHistory.state = 'inactive';
            stateHistory.endTime = new Date();
        }

        return this.stateHistoryRepository.save(stateHistory);
    }

    private async createStateLog(objectId: string, entity: EntityType, newState: string): Promise<StateHistory> {
        return this.stateHistoryRepository.create(
            new StateHistory({
                objectId: objectId,
                entity: entity,
                entityState: newState,
                state: 'active',
                startTime: new Date(),
            })
        );
    }

    async recordStateChange(objectId: string, entity: EntityType, newState: string): Promise<StateHistory> {
        const currentState: StateHistory = await this.stateHistoryRepository.getCurrentStateLogByObjectId(objectId);

        if (currentState) {
            await this.inactivateStateLog(currentState);
        }

        return await this.createStateLog(objectId, entity, newState);
    }
}