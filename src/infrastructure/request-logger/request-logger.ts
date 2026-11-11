import { pino, Logger as PinoLogger } from 'pino';
import { RandomUtils } from '@domain/utils/random';
import {
    RequestLoggerConfigs,
    LogEntryType,
    LogEntry,
    LogInsertResponse,
    RequestData,
    ResponseData,
    ErrorData,
} from '@infrastructure/request-logger';


export interface RequestLogger {
    request(data: RequestData): Promise<LogInsertResponse>;
    response(data: ResponseData): Promise<void>;
    error(data: ErrorData): Promise<void>;
}


export class RequestLoggerImpl implements RequestLogger {
    private readonly folderPath: string;
    private readonly fileName: string;
    private readonly pinoLogger: PinoLogger;

    constructor(
        private readonly config: RequestLoggerConfigs,
    ) {
        this.folderPath = config.folderPath;
        this.fileName = config.fileName;
        this.pinoLogger = pino(
            {
                base: null,
                formatters: {
                    level: (label) => {
                        return { level: label.toUpperCase() };
                    },
                },
                timestamp: pino.stdTimeFunctions.isoTime,
            },
            pino.destination(`${this.folderPath}/${this.fileName}`)
        );
    }

    async request(data: RequestData): Promise<LogInsertResponse> {
        const request_id: string = RandomUtils.generateString(20);

        const entry: LogEntry = {
            type: LogEntryType.Request,
            request_id,
            body: data,
        };

        try {
            await this.pinoLogger.info(entry);
        } catch (e) {
            console.log('Could not save request log', e);
        }

        return { request_id };
    }

    async response(data: ResponseData): Promise<void> {
        const entry: LogEntry = {
            type: LogEntryType.Response,
            request_id: data.request_id,
            body: data.response,
        };

        try {
            await this.pinoLogger.info(entry);
        } catch (e) {
            console.log('Could not save response log', e);
        }
    }

    async error(data: ErrorData): Promise<void> {
        const entry: LogEntry = {
            type: LogEntryType.Response,
            request_id: data.request_id,
            body: data.error,
        };

        try {
            await this.pinoLogger.error(entry);
        } catch (e) {
            console.log('Could not save error log', e);
        }
    }
}