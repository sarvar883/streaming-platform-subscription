import { BaseEntity, BaseModel, TypesIdentifier } from '@domain/_core';


export interface SetantaUserModel extends BaseModel {
    externalUserId: string | TypesIdentifier;
    source: string;
}

export class SetantaUser extends BaseEntity<SetantaUserModel> {
    get _id() {
        return this.model._id;
    }

    get externalUserId() {
        return this.model.externalUserId;
    }

    get source(): string {
        return this.model.source;
    }
}