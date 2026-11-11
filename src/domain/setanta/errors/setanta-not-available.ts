import { AnyObject } from '@payme/common';
import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class SetantaServiceUnavailableError extends CustomError {
    constructor(data: AnyObject) {
        const code = SetantaErrorCodes.SetantaServiceUnavailable;

        const message: MultiLanguage = {
            ru: "Сервис Сетанты не отвечает",
            en: "Setanta service not available",
            uz: "Setanta sistemasi javob bermadi",
        };

        super(code, message, data);
    }
}