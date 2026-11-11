import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class SubscriptionNotFoundInSetantaError extends CustomError {
    constructor() {
        const code = SetantaErrorCodes.SubscriptionNotFoundInSetanta;

        const message: MultiLanguage = {
            ru: "Подписка не найдена в системе Сетанты",
            en: "Subscription not found in Setanta",
            uz: "Ushbu obuna Setanta sistemasida mavjud emas",
        };

        super(code, message);
    }
}