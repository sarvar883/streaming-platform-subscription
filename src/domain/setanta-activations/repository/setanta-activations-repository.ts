import { SetantaActivation } from '@domain/setanta-activations';

export interface SetantaActivationsRepository {
    getById(activationId: string): Promise<SetantaActivation>;

    getByUserId(setantaUserId: string): Promise<SetantaActivation | null>;

    save(activation: SetantaActivation): Promise<SetantaActivation>;

    create(data: SetantaActivation): Promise<SetantaActivation>;

    updateActivation(subscription_id: string, update: Record<string, any>): Promise<void>;
}