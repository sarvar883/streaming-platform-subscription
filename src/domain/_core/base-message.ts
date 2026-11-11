import { HexString } from '@domain/_core';

export type MessageKey<InstanceId extends string> = `${InstanceId}:${HexString}`;

export type Message<Key extends MessageKey<string>, Payload extends object> = {
    key: Key;
    value: Payload;
};