import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { PaymeUsersErrorCodes } from '@domain/payme-users';

export class UserPhoneNotFoundError extends CustomError {
    constructor() {
        const code = PaymeUsersErrorCodes.UserPhoneNotFound;

        const message: MultiLanguage = {
            ru: "Номер телефона пользователя не найден",
            en: "User phone not found",
            uz: "Foydalanuvchining telefon raqami topilmadi",
        };

        super(code, message);
    }
}