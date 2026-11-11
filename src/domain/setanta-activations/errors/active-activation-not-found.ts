import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaActivationErrorCodes } from '@domain/setanta-activations';

export class ActiveActivationNotFoundError extends CustomError {
    constructor() {
        const code = SetantaActivationErrorCodes.ActiveActivationNotFound;

        const message: MultiLanguage = {
            ru: "Активная подписка этого юзера не найдена в БД",
            en: "Active activation of this user not found in DB",
            uz: "Ushbu foydalanuvchida aktiv obuna bazada topilmadi",
        };

        super(code, message);
    }
}