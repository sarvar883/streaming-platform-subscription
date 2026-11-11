import { EntityType } from '@domain/_core';
import { StateHistoryService } from '@domain/state-history';

export type StateRules<T extends string> = {
    [key in T]: readonly T[];
};

export interface Stateful<Entity = StatefulEntity<string>, EntityState = any, CreateParams = any> {
    changeState(entity: Entity, state: EntityState): Promise<Entity>;

    create(params: CreateParams): Promise<Entity>;
    // get<Entity>(id: string): Promise<Entity>;
    // getByState<Entity, EntityState>(state: EntityState): Promise<Entity[]>;
    // getByStateAsyncIterable<Entity, EntityState>(state: EntityState): Promise<AsyncIterable<Entity>>;
    // save(entity: Entity): Promise<Entity>;
}

export interface StatefulEntity<EntityState extends string> {
    state: EntityState;
}

export interface StatefulModel<EntityState extends string> {
    state: EntityState;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Stateful {
    type Constructor<T> = {
        new (stateHistoryService: StateHistoryService, ...args: any[]): T;
        readonly prototype: T;
    };

    const rulesRegistry = new Map<string, StateRules<string>>();

    type StateChangeFunction = TypedPropertyDescriptor<(entity: StatefulEntity<string>, state: string) => Promise<any>>;

    type ValidateNextStatusMethodDecorator<T> = (
        target: Stateful,
        key: string | symbol,
        descriptor: StateChangeFunction
    ) => StateChangeFunction;

    export function registerRules<EntityStatesType extends string>(
        entity: EntityType,
        rules: StateRules<EntityStatesType>
    ): void {
        rulesRegistry.set(entity, rules);
    }

    export function register<T extends Constructor<Stateful>>(constructor: T): T {
        const c = constructor;

        c.prototype.create = trackState()(c.prototype, 'create', { value: c.prototype.create })['value'];

        c.prototype.changeState = trackState()(c.prototype, 'changeState', { value: c.prototype.changeState })['value'];

        c.prototype.changeState = validateStateChange()(c.prototype, 'changeState', { value: c.prototype.changeState })[
            'value'
        ];

        return c;
    }

    export const trackState = (): MethodDecorator => {
        return (target: Stateful | Object, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
            const originalMethod = descriptor.value;
            descriptor.value = async function (...args: any[]): Promise<any> {
                const result = await originalMethod!.apply(this, args);
                // @ts-ignore
                await this.stateHistoryService.recordStateChange(result.id, this.entityType || 'unknown', result.state);

                return result;
            };
            return descriptor;
        };
    };

    export const validateStateChange = <T>(): ValidateNextStatusMethodDecorator<T> => {
        return (
            target: Stateful,
            propertyKey: string | symbol,
            descriptor: StateChangeFunction
        ): StateChangeFunction => {
            const originalMethod = descriptor.value;

            descriptor.value = async function (entity, newState, ...args: any[]): Promise<any> {
                const currentState: string = entity.state;
                // @ts-ignore
                if (!rulesRegistry.get(this.entityType)[currentState].includes(newState)) {
                    throw new Error(`Invalid state change from ${currentState} to ${newState}`); //TODO: use custom error
                }

                const result = await originalMethod!.apply(this, [entity, newState, ...args]);

                return result;
            };
            return descriptor;
        };
    };
}