import { MultiLanguage } from '@domain/_core';
import { CommonErrorCodes } from '@domain/errors';

export type BaseError = {
    code: CommonErrorCodes;
    multiLangMessage: MultiLanguage;
    data?: Record<string, any>;
}