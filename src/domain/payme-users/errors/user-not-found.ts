import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { PaymeUsersErrorCodes } from '@domain/payme-users';

export class UserNotFoundError extends CustomError {
    constructor() {
        const code = PaymeUsersErrorCodes.UserNotFound;

        const message: MultiLanguage = {
            ru: "Пользователь не найден",
            en: "User not found",
            uz: "Foydalanuvchi topilmadi",
        };

        super(code, message);
    }
}