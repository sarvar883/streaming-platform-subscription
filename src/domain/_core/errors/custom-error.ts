import { MultiLanguage } from '@domain/_core';
import { BaseError } from '@domain/_core/errors/base-error';

export class CustomError extends Error implements BaseError {
    private readonly _code: number;
    private readonly _multiLangMessage: MultiLanguage;
    private readonly _data: unknown;

    constructor(code: number, message: MultiLanguage, data: unknown = {}) {
        super();
        this._code = code;
        this._multiLangMessage = message;
        this._data = data;
    }

    get code(): number {
        return this._code;
    }

    get multiLangMessage(): MultiLanguage {
        return this._multiLangMessage;
    }

    get data(): unknown {
        return this._data;
    }
}