import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class UserNotFoundInSetantaError extends CustomError {
    constructor() {
        const code = SetantaErrorCodes.UserNotFoundInSetanta;

        const message: MultiLanguage = {
            ru: "Пользователь не найден в системе Сетанты",
            en: "User not found in Setanta",
            uz: "Setanta sistemasida foydalanuvchi topilmadi",
        };

        super(code, message);
    }
}