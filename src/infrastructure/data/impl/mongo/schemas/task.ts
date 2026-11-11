import { Schema, SchemaTypes } from 'mongoose';
import { TaskModel } from '@domain/task';

export const TaskSchema = new Schema<TaskModel>(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
        subscriptionId: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
        instruction: {
            type: SchemaTypes.String,
            required: true,
        },
        state: {
            type: SchemaTypes.String,
            required: true,
        },
        activationId: {
            type: SchemaTypes.ObjectId,
            required: false,
            default: null,
        },
        createdAt: {
            type: SchemaTypes.Date,
            required: true,
        },
        processTime: {
            type: SchemaTypes.Date,
            required: true,
        },
        completedAt: {
            type: SchemaTypes.Date,
            default: null,
        },
        lastUpdatedAt: {
            type: SchemaTypes.Date,
            default: null,
        },
        locked: {
            type: SchemaTypes.Boolean,
            required: true,
        },
        lockedAt: {
            type: SchemaTypes.Date,
            default: null,
        },
        attempts: {
            type: SchemaTypes.Number,
            default: 0,
        },
        conflictingTaskId: {
            type: SchemaTypes.ObjectId,
            required: false,
            default: null,
        },
        error: {
            type: SchemaTypes.Map,
            default: null,
            required: false,
        },
        erroredAt: {
            type: SchemaTypes.Date,
            default: null,
        },
    },
    {
        collection: 'tasks',
    },
);

TaskSchema.pre('save', function (next) {
    this.lastUpdatedAt = new Date()
    next();
});