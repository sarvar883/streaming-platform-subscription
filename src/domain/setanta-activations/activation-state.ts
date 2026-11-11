import { StateRules } from '@domain/state-history/stateful';

export enum ActivationState {
    Created = 'created',
    ErrorWhileActivation = 'error_while_activation',
    Active = 'active',
    ErrorWhileCancel = 'error_while_cancel',
    Canceled = 'canceled',
}

export const activationRules: StateRules<ActivationState> = {
    [ActivationState.Created]: [ActivationState.ErrorWhileActivation, ActivationState.Active],
    [ActivationState.ErrorWhileActivation]: [ActivationState.Active],
    [ActivationState.Active]: [ActivationState.ErrorWhileCancel, ActivationState.Canceled],
    [ActivationState.ErrorWhileCancel]: [ActivationState.Canceled],
    [ActivationState.Canceled]: [],
} as const;