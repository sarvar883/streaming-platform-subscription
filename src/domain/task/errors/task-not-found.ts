import { MultiLanguage } from '@domain/_core';
import { CustomError } from '@domain/_core/errors';
import { TaskErrorCodes } from '@domain/task';

export class TaskNotFoundError extends CustomError {
    constructor(id: string) {
        const code = TaskErrorCodes.TaskNotFound;

        const message: MultiLanguage = {
            ru: `Таск с id ${id} в БД не найден`,
            en: `Task with id ${id} not found`,
            uz: `${id} ga ega vazifa topilmadi`,
        };

        super(code, message);
    }
}