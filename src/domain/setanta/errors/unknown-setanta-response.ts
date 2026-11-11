import { AnyObject } from '@payme/common';
import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class UnknownSetantaResponseError extends CustomError {
    constructor(response: AnyObject) {
        const code = SetantaErrorCodes.SetantaUnknownResponseError;

        const message: MultiLanguage = {
            ru: "Получен непонятный ответ от Сетанты",
            en: "Got unknown response from Setanta",
            uz: "Setanta sistemasidan no'malum javob olindi",
        };

        super(code, message, response);
    }
}