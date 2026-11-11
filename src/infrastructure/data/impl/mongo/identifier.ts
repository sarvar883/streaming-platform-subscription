import { Types } from 'mongoose';
import { Identifier, TypesIdentifier } from '@domain/_core';


export function IdentifierToObjectID(value: TypesIdentifier | null): Types.ObjectId | null;

export function IdentifierToObjectID(value: TypesIdentifier | undefined): Types.ObjectId | undefined;

export function IdentifierToObjectID(value: TypesIdentifier | null | undefined): Types.ObjectId | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const str = value.toString();
    return new Types.ObjectId(str);
}

export function ObjectIdToIdentifier(value: Types.ObjectId | null): TypesIdentifier | null;

export function ObjectIdToIdentifier(value: Types.ObjectId | undefined): TypesIdentifier | undefined;

export function ObjectIdToIdentifier(value: Types.ObjectId | null | undefined): TypesIdentifier | null | undefined {
    return new Identifier(value ? value.toString() : value);
}

const isValid = (id: string | number ): boolean => Types.ObjectId.isValid(id);

export { isValid };