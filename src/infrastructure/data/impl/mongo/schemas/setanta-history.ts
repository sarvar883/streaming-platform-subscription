import { Schema, SchemaTypes } from 'mongoose';
import { IdentifierToObjectID, ObjectIdToIdentifier } from '@data/impl/mongo/identifier';
import { StateHistoryModel } from '@domain/state-history';

export const StateHistorySchema = new Schema<StateHistoryModel>(
    {
        objectId: {
            type: SchemaTypes.ObjectId,
            set: IdentifierToObjectID,
            get: ObjectIdToIdentifier,
        },
        entity: {
            type: String,
            required: true,
        },
        entityState: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
        },
    },
    {
        collection: 'stateHistory',
    },
);