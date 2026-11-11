import { TypesIdentifier } from '@domain/_core/identifier';

export type IdentifierToString<T> = {
    [K in keyof T]: T[K] extends TypesIdentifier | undefined | null
        ? T[K] extends TypesIdentifier | undefined
            ? string
            : T[K] extends TypesIdentifier | null
            ? string | null
            : string | undefined
        : T[K] extends object
        ? IdentifierToString<T[K]>
        : T[K];
};

export type Invalid<T> = Error & { __errorMessage: T };

export type NoOverlap<T1, T2 = Omit<NonNullable<unknown>, '_id'>> = Extract<
    keyof Omit<T1, 'id'>,
    keyof T2
> extends never
    ? Omit<T1, 'id'>
    : Invalid<[Extract<keyof T1, keyof T2>, 'is repeated']>;

export type RequiredFieldsOnly<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
