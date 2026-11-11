import { Schema, SchemaTypes } from 'mongoose';
import { SetantaUserModel } from '@domain/setanta-users';

export const SetantaUserSchema = new Schema<SetantaUserModel>(
    {
        externalUserId: {
            type: SchemaTypes.ObjectId,
            default: null
        },
        source: {
            type: SchemaTypes.String,
            required: true,
        },
    },
    {
        collection: 'users',
    }
);