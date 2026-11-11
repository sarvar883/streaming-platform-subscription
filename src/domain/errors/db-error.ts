import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { CommonErrorCodes } from '@domain/errors';

export class DbError extends CustomError {
    constructor() {
        const code = CommonErrorCodes.DbError;

        const message: MultiLanguage = {
            ru: "Ошибка при подключении к БД",
            en: "Error connecting to the database",
            uz: "Ma'lumotlar bazasiga ulanishda xato",
        };

        super(code, message);
    }
}