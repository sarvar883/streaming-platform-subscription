import { BaseEntity, BaseModel } from '@domain/_core';

export interface PaymeUserModel extends BaseModel {
    phone: string;
}

export class PaymeUser extends BaseEntity<PaymeUserModel> {
    get phone(): string {
        return this.model.phone;
    }
}