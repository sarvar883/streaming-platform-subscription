import * as CoreDomain from '@domain/_core';

type AsUniqueArray<Array extends ReadonlyArray<any>> = {
    [Index in keyof Array]: unknown extends {
            [PossiblySameIndex in keyof Array]: PossiblySameIndex extends Index
                ? never
                : Array[PossiblySameIndex] extends Array[Index]
                    ? unknown
                    : never;
        }[number]
        ? CoreDomain.Invalid<[Array[Index], 'is repeated']>
        : Array[Index];
};

type Narrowable = string | number | boolean | object | null | undefined | symbol;

export type SymbolsListType<T extends readonly string[]> = {
    [symbolName in T[number]]: symbol;
};

export type Pairs = { [name: Readonly<string>]: ReadonlyArray<string> | Pairs };

function StringToSymbol<ARRAY extends ReadonlyArray<string>>(
    array: ARRAY,
    prefix: string,
    suffix = ''
): SymbolsListType<ARRAY> {
    return array.reduce((obj: SymbolsListType<ARRAY>, value: ARRAY[number]) => {
        obj[value] = Symbol.for(`${prefix}_${suffix}_${value}`);
        return obj;
    }, {} as SymbolsListType<ARRAY>);
}

export type LiteralFromObject<T> = keyof T;

export const asUniqueArray = <
    TypeOfElementOfArray extends Narrowable,
    Array extends [] | (ReadonlyArray<TypeOfElementOfArray> & AsUniqueArray<Array>)
>(
    a: Array
): Array => a;

export type ComplexSymbolListType<T extends Readonly<Pairs>> = {
    [symbolName in keyof T]: T[symbolName] extends ReadonlyArray<string>
        ? SymbolsListType<T[symbolName]>
        : ComplexSymbolListType<T[symbolName] & Readonly<Pairs>>;
};

export function generateSymbols<T extends Readonly<Pairs>>(pairs: T, suffix = ''): ComplexSymbolListType<T> {
    const symbols = {} as ComplexSymbolListType<T>;
    const entries = Object.entries(pairs) as [keyof T, T[keyof T]][];
    for (const [key, value] of entries) {
        if (isStringArray(value)) {
            symbols[key] = StringToSymbol(value, key as string, suffix) as ComplexSymbolListType<T>[keyof T];
        } else {
            symbols[key] = generateSymbols(value, suffix + '_' + (key as string)) as ComplexSymbolListType<T>[keyof T];
        }
    }
    return symbols;
}

function isStringArray(value: any): value is ReadonlyArray<string> {
    return Array.isArray(value);
}

export function asLiterals<T extends string>(array: T[]): T[] {
    return array;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type IntersectingTypesInner<Target, Structure> = {
    [Key in Extract<Structure, keyof Target>]: Target[Key];
};

export type IntersectingTypes<Target, Structure> = {
    [Key in Extract<keyof Structure, keyof Target>]: IsUnion<Structure[Key]> extends true
        ? IntersectingTypesInner<Target[Key], Structure[Key]>
        : Structure[Key] extends string
            ? IntersectingTypesInner<Target[Key], Structure[Key]>
            : IntersectingTypes<Target[Key], Structure[Key]>;
};

type NonObjectKeysOf<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K;
}[keyof T];

type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T extends object> = Exclude<Exclude<Extract<ValuesOf<T>, object>, never>, Array<any>>;

export type Flatten<T extends object> = Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<ObjectValuesOf<T>>;