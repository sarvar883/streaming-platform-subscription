import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { QueueErrorCodes } from '@infrastructure/queue';

export class QueueFullError extends CustomError {
    constructor() {
        const code = QueueErrorCodes.QueueFull;

        const message: MultiLanguage = {
            ru: "Очередь забита тасками",
            en: "Queue is full",
            uz: "Queue to'lgan",
        };

        super(code, message);
    }
}