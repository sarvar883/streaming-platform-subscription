export function enumerable(value = true) {
    return function (target: NonNullable<unknown>, propertyKey: string): void {
        Object.defineProperty(target, propertyKey, { enumerable: value });
    };
}

export function JSON<T extends { new (...args: any[]): any }>(constructor: T): T {
    return class extends constructor {
        toJSON(): any {
            const proto = Object.getPrototypeOf(this);
            const jsonObj: any = Object.assign({}, this);

            Object.entries(Object.getOwnPropertyDescriptors(proto))
                .filter(([key, descriptor]) => typeof descriptor.get === 'function')
                .map(([key, descriptor]) => {
                    if (descriptor && key[0] !== '_') {
                        try {
                            jsonObj[key] = (this as any)[key];
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.error(`Error calling getter ${key}`, error);
                        }
                    }
                });

            return { ...jsonObj, id: (this as any).id || undefined };
        }
    };
}
