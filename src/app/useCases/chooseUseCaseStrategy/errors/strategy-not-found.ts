import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';

export class UseCaseNotFoundError extends CustomError {
    constructor() {
        const code = -1;

        const message: MultiLanguage = {
            ru: "Невозможно выполнить операцию. Юзкейс не найден",
            en: "Cannot complete operation. UseCase not found",
            uz: "Vazifa bajarib bo'lmaydi. UseCase topilmadi",
        };

        super(code, message);
    }
}