import { Timestamp } from '@domain/_core';

export class DateUtils {
    static addMsToDate(date: Date, ms: number) {
        const timeStamp: Timestamp = new Date(date).getTime();

        return new Date(timeStamp + ms);
    }
}