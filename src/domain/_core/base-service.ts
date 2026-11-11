const EntityType = [
    'activation',
    'payme_user',
    'setanta_user',
    'task',
] as const;
export type EntityType = (typeof EntityType)[number];

export class BaseService {
    private readonly _entityType: EntityType;

    constructor(entityType: EntityType) {
        this._entityType = entityType;
    }

    get entityType(): EntityType {
        return this._entityType;
    }
}