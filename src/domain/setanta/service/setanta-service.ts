import {
    SetantaServiceRepository,
    ActivationParams,
    ActivateResponse,
    CheckParams,
    CheckResponse,
    CancelParams,
    CancelResponse,
} from '@domain/setanta';

export interface SetantaService {
    checkSubscription(params: CheckParams): Promise<CheckResponse>;
    activateSubscription(params: ActivationParams): Promise<ActivateResponse>;
    cancelSubscription(params: CancelParams): Promise<CancelResponse>;
}

export class SetantaServiceImpl implements SetantaService {
    constructor(
        private readonly setantaRepository: SetantaServiceRepository,
    ) {}

    async checkSubscription(params: CheckParams): Promise<CheckResponse> {
        const setantaUserId: string = params.setantaUserId;
        return await this.setantaRepository.check(setantaUserId);
    }

    async activateSubscription(params: ActivationParams): Promise<ActivateResponse> {
        return await this.setantaRepository.activate(params);
    }

    async cancelSubscription(params: CancelParams): Promise<CancelResponse> {
        const subscriptionId: string = params.subscriptionId;
        return await this.setantaRepository.cancel(subscriptionId);
    }
}