import { StateHistory } from '@domain/state-history';

export interface StateHistoryRepository {
    save(activation: StateHistory): Promise<StateHistory>;

    create(activation: StateHistory): Promise<StateHistory>;

    getCurrentStateLogByObjectId(objectId: string): Promise<StateHistory>;
}