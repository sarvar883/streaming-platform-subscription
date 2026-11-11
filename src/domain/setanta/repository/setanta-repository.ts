import { ActivationParams, ActivateResponse, CheckResponse, CancelResponse } from '@domain/setanta';

export interface SetantaServiceRepository {
    check(setantaUserId: string): Promise<CheckResponse>;
    activate(params: ActivationParams): Promise<ActivateResponse>;
    cancel(subscriptionId: string): Promise<CancelResponse>;
}