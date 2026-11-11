import { Identifier, TypesIdentifier } from '@domain/_core';
import { IdentifierToString, NoOverlap, RequiredFieldsOnly } from '@domain/utils/type-helpers';
import { enumerable, JSON } from '@domain/utils/entity';

export class BaseEntity<T> {
    @enumerable()
    protected model!: T & { id: TypesIdentifier };
    @enumerable()
    private create_data?: NoOverlap<IdentifierToString<RequiredFieldsOnly<T>>>;

    constructor(data?: NoOverlap<IdentifierToString<RequiredFieldsOnly<T>>>) {
        Object.defineProperty(this, 'create_data', { value: data });
        Object.defineProperty(this, 'model', { value: data });
    }

    get id(): string {
        return this.model.id.toString();
    }

    set id(id: string) {
        this.model.id = new Identifier(id);
    }

    toString(): string {
        return global.JSON.stringify(this);
    }

    toJSON(): T & { id: string } {
        delete this['__v'];

        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = Object.assign({}, this);

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key) {
                    try {
                        jsonObj[key] = (this as any)[key];
                    } catch (error) {
                        // eslint-disable-next-line no-console
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }
}

@JSON
export class BaseVO<Model, KEY extends keyof Model, VO> {
    @enumerable()
    protected vo!: Model[KEY];

    constructor(data?: RequiredFieldsOnly<VO>, vo?: Model[KEY]) {
        Object.defineProperty(this, 'vo', { enumerable: false, value: vo || data || {} });
        if (data) {
            Object.assign(this.vo, data);
        }
    }
}
