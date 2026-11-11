export type HexString = string;

export interface TypesIdentifier {
    type: 'Identifier';

    toString(): string;
}

export class Identifier implements TypesIdentifier {
    type = 'Identifier' as const;

    constructor(private identifier: any) {}

    toString(): string {
        return this.identifier;
    }
}