import { Schema, SchemaTypes } from 'mongoose';
import { PaymeUserModel } from '@domain/payme-users';

export const PaymeUserSchema = new Schema<PaymeUserModel>(
    {
        phone: {
            type: SchemaTypes.String,
            required: true,
        },
    },
    {
        collection: 'users',
    },
);