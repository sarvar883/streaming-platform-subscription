import { EntityType } from '@domain/_core';
import { BaseEntity, BaseModel, TypesIdentifier } from '@domain/_core';
import { StateOfState } from '@domain/state-history';

export interface StateHistoryModel extends BaseModel {
    objectId: TypesIdentifier;
    entity: EntityType;
    entityState: string;
    state: StateOfState;
    startTime: Date;
    endTime?: Date;
}

export class StateHistory extends BaseEntity<StateHistoryModel> {
    get objectId(): TypesIdentifier {
        return this.model.objectId;
    }

    get entity(): EntityType {
        return this.model.entity;
    }

    get entityState(): string {
        return this.model.entityState;
    }

    get state(): StateOfState {
        return this.model.state;
    }

    set state(newState: StateOfState) {
        this.model.state = newState;
    }

    get startTime(): Date {
        return this.model.startTime;
    }

    get endTime(): Date {
        return this.model.endTime;
    }

    set endTime(endTime: Date) {
        this.model.endTime = endTime;
    }
}