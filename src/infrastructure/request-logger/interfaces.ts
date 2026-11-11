import { AnyObject } from '@payme/common';

export type RequestLoggerConfigs = {
    folderPath: string;
    fileName: string;
}

export enum LogEntryType {
    Request = 'request',
    Response = 'response',
}

export type LogEntry = {
    type: LogEntryType;
    request_id: string;
    body: AnyObject;
}

export type LogInsertResponse = {
    request_id: string;
}

export type RequestData = {
    method: string;
    data: AnyObject;
}

export type ResponseData = {
    request_id: string;
    response: AnyObject;
}

export type ErrorData = {
    request_id: string;
    error: AnyObject;
}