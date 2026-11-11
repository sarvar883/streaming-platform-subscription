import { BaseService } from '@domain/_core';
import { Stateful, StateHistoryService } from '@domain/state-history';
import {
    CreateActivationParams,
    ActivationState,
    activationRules,
    CheckActivationResponse,
    SetantaActivation,
    SetantaActivationsRepository,
    ChangeStateAdditional,
    ActivationErrorData,
    ActivationSuccessData,
    CancelErrorData,
} from '@domain/setanta-activations';


export interface SetantaActivationsService {
    getById(activationId: string): Promise<SetantaActivation>;

    create(params: CreateActivationParams): Promise<SetantaActivation>;

    changeState(activation: SetantaActivation, state: ActivationState, additionalData?: ChangeStateAdditional): Promise<SetantaActivation>;

    checkForActiveActivation(setantaUserId: string): Promise<CheckActivationResponse>;
}


Stateful.registerRules<ActivationState>('activation', activationRules);
@Stateful.register
export class SetantaActivationsServiceImpl extends BaseService implements SetantaActivationsService {
    constructor(
        private readonly stateHistoryService: StateHistoryService,
        private readonly setantaActivationsRepository: SetantaActivationsRepository,
    ) {
        super('activation');
    }

    async getById(activationId: string): Promise<SetantaActivation> {
        return await this.setantaActivationsRepository.getById(activationId);
    }

    async create(params: CreateActivationParams): Promise<SetantaActivation> {
        let activation: SetantaActivation = new SetantaActivation({
            userId: params.setantaUserId,
            subscriptionId: params.paymeSubscriptionId,
            state: ActivationState.Created,
            createdAt: new Date(),
        });

        activation = await this.setantaActivationsRepository.create(activation);

        return activation;
    }

    async changeState(activation: SetantaActivation, state: ActivationState, additionalData: ChangeStateAdditional = {}): Promise<SetantaActivation> {
        activation.state = state;

        if (state === ActivationState.ErrorWhileActivation) {
            activation.activationErroredAt = new Date();
            activation.error = (additionalData as ActivationErrorData).error;
        }

        if (state === ActivationState.Active) {
            activation.activatedAt = new Date();

            let successData = additionalData as ActivationSuccessData;

            activation.setantaSubscriptionId = successData.setantaSubscriptionId;
            activation.setantaAccountActivationUrl = successData.setantaAccountActivationUrl;
            activation.netflixAccountActivationUrl = successData.netflixAccountActivationUrl;
        }

        if (state === ActivationState.ErrorWhileCancel) {
            activation.cancelErroredAt = new Date();
            activation.error = (additionalData as CancelErrorData).error;
        }

        if (state === ActivationState.Canceled) {
            activation.canceledAt = new Date();
        }

        return await this.setantaActivationsRepository.save(activation);
    }

    async checkForActiveActivation(setantaUserId: string): Promise<CheckActivationResponse> {
        const activation: SetantaActivation | null = await this.setantaActivationsRepository.getByUserId(setantaUserId);

        if (activation?.state === ActivationState.Active) {
            return {
                hasActiveActivation: true,
                activationId: activation.id,
            };
        }

        return { hasActiveActivation: false };
    }
}