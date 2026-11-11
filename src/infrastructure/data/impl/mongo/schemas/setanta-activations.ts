import { Schema, SchemaTypes } from 'mongoose';
import { SetantaActivationModel } from '@domain/setanta-activations';

export const SetantaActivationSchema = new Schema<SetantaActivationModel>(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            default: null,
        },
        subscriptionId: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
        state: {
            type: SchemaTypes.String,
            required: true,
        },

        setantaSubscriptionId: {
            type: SchemaTypes.String,
            required: false,
        },
        setantaAccountActivationUrl: {
            type: SchemaTypes.String,
            required: false,
        },
        netflixAccountActivationUrl: {
            type: SchemaTypes.String,
            required: false,
        },

        createdAt: {
            type: SchemaTypes.Date,
            default: new Date(),
            required: true,
        },
        activationErroredAt: {
            type: SchemaTypes.Date,
            default: null,
            required: false,
        },
        activatedAt: {
            type: SchemaTypes.Date,
            default: null,
            required: false,
        },
        canceledAt: {
            type: SchemaTypes.Date,
            default: null,
            required: false,
        },
        cancelErroredAt: {
            type: SchemaTypes.Date,
            default: null,
            required: false,
        },
        error: {
            type: SchemaTypes.Map,
            default: null,
            required: false,
        },
    },
    {
        collection: 'activations',
    },
);