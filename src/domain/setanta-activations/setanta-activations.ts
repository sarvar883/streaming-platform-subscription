import { BaseEntity, BaseModel, TypesIdentifier } from '@domain/_core';
import { ActivationState } from '@domain/setanta-activations'

export interface SetantaActivationModel extends BaseModel {
    userId: TypesIdentifier;
    subscriptionId: TypesIdentifier;
    state: ActivationState;
    setantaSubscriptionId?: string | null;
    setantaAccountActivationUrl?: string | null;
    netflixAccountActivationUrl?: string | null;
    createdAt: Date;
    activationErroredAt?: Date | null;
    activatedAt?: Date | null;
    canceledAt?: Date | null;
    cancelErroredAt?: Date | null;
    error?: Record<string, any> | null;
}

export class SetantaActivation extends BaseEntity<SetantaActivationModel> {
    get userId(): string {
        return this.model.userId.toString();
    }

    get subscriptionId(): string {
        return this.model.subscriptionId.toString();
    }

    get state(): ActivationState {
        return this.model.state;
    }

    set state(value: ActivationState) {
        this.model.state = value;
    }

    get setantaSubscriptionId(): string {
        return this.model.setantaSubscriptionId;
    }

    set setantaSubscriptionId(id: string) {
        this.model.setantaSubscriptionId = id;
    }

    get setantaAccountActivationUrl(): string {
        return this.model.setantaAccountActivationUrl;
    }

    set setantaAccountActivationUrl(url: string) {
        this.model.setantaAccountActivationUrl = url;
    }

    get netflixAccountActivationUrl(): string {
        return this.model.netflixAccountActivationUrl;
    }

    set netflixAccountActivationUrl(url: string) {
        this.model.netflixAccountActivationUrl = url;
    }

    get createdAt(): Date {
        return this.model.createdAt;
    }

    get activationErroredAt(): Date | null {
        return this.model.activationErroredAt;
    }

    set activationErroredAt(date: Date) {
        this.model.activationErroredAt = date;
    }

    get activatedAt(): Date | null {
        return this.model.activatedAt;
    }

    set activatedAt(date: Date) {
        this.model.activatedAt = date;
    }

    get canceledAt(): Date | null {
        return this.model.canceledAt;
    }

    set canceledAt(date: Date) {
        this.model.canceledAt = date;
    }

    get cancelErroredAt(): Date | null {
        return this.model.cancelErroredAt;
    }

    set cancelErroredAt(date: Date) {
        this.model.cancelErroredAt = date;
    }

    get error(): Record<string, any> | null {
        return this.model.error;
    }

    set error(error: Record<string, any> | null) {
        this.model.error = error;
    }
}