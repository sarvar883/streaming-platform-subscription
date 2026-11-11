import { EntityModel, MongooseRepository } from '@data/impl/mongo';

import {
    SetantaActivation,
    SetantaActivationModel,
    SetantaActivationsRepository,
} from '@domain/setanta-activations';


export class SetantaActivationsRepositoryImpl extends MongooseRepository<SetantaActivationModel, SetantaActivation> implements SetantaActivationsRepository {
    constructor(
        private readonly entityModel: EntityModel<SetantaActivationModel>,
    ) {
        super(entityModel, SetantaActivation);
    }

    async updateActivation(subscription_id: string, update: Record<string, any>): Promise<void> {
        await this.updateOne({ _id: subscription_id }, update);
    }

    async getByUserId(setantaUserId: string): Promise<SetantaActivation | null> {
        const query = {
            userId: setantaUserId,
        };

        return await this.getOne(query);
    }
}