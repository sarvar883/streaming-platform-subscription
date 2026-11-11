import { Instruction } from '@domain/task';

export type EventPayload = {
    userId: string;
    subscriptionId: string;
}

export type EventHandleUseCaseInput = {
    payload: EventPayload;
    instruction: Instruction;
}