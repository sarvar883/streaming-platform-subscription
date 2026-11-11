import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class SetantaActivationAlreadyExistsError extends CustomError {
    constructor() {
        const code = SetantaErrorCodes.UserHasActiveSubscription;

        const message: MultiLanguage = {
            ru: "У пользователя уже есть активная подписка в Сетанте",
            en: "User already has active subscription in Setanta",
            uz: "Foydalanuvchida Setanta sistemasida faol obuna mavjud",
        };

        super(code, message);
    }
}