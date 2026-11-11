import { AnyObject } from '@payme/common';
import { Milliseconds } from '@domain/_core';

export type TaskServiceConfig = {
    debounceTimeAfterCreate: Milliseconds;
    debounceTimeForRetry: Milliseconds;
}

export enum Instruction {
    On = 'on',
    Off = 'off',
}

export type CreateTaskParams = {
    userId: string;
    subscriptionId: string;
    instruction: Instruction;
}

export type ChangeTaskStateAdditional = {
    activationId?: string | null;
    conflictingTaskId?: string | null;
    error?: AnyObject | null;
}