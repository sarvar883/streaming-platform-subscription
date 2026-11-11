import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { SetantaErrorCodes } from '@domain/setanta';

export class SetantaCertificatesNotFoundError extends CustomError {
    constructor() {
        const code = SetantaErrorCodes.SetantaCertificatesNotFound;

        const message: MultiLanguage = {
            ru: "Файлы сертификатов Сетанты не найдены",
            en: "Setanta certificate files not found",
            uz: "Setanta sertifikatlari topilmadi",
        };

        super(code, message);
    }
}