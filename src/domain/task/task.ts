import { AnyObject } from '@payme/common';
import { BaseEntity, BaseModel, TypesIdentifier, Identifier } from '@domain/_core';
import { TaskState, Instruction } from '@domain/task';

export interface TaskModel extends BaseModel {
    userId: TypesIdentifier;
    subscriptionId: TypesIdentifier;

    instruction: Instruction;
    state: TaskState;
    activationId?: TypesIdentifier;

    createdAt: Date;
    processTime: Date;
    completedAt?: Date;
    lastUpdatedAt?: Date;
    locked: boolean;
    lockedAt?: Date;
    attempts?: number;
    conflictingTaskId?: TypesIdentifier;
    error?: AnyObject;
    erroredAt?: Date;
}

export class Task extends BaseEntity<TaskModel> {
    get userId(): string {
        return this.model.userId.toString();
    }

    get subscriptionId(): string {
        return this.model.subscriptionId.toString();
    }

    get instruction(): Instruction {
        return this.model.instruction;
    }

    get state(): TaskState {
        return this.model.state;
    }

    set state(value: TaskState) {
        this.model.state = value;
    }

    get activationId(): string | null {
        return this.model.activationId?.toString?.();
    }

    set activationId(activationId: string) {
        this.model.activationId = new Identifier(activationId);
    }

    get createdAt(): Date {
        return this.model.createdAt;
    }

    get processTime(): Date {
        return this.model.processTime;
    }

    set processTime(processTime: Date) {
        this.model.processTime = processTime;
    }

    get completedAt(): Date {
        return this.model.completedAt;
    }

    set completedAt(date: Date) {
        this.model.completedAt = date;
    }

    get lastUpdatedAt(): Date {
        return this.model.lastUpdatedAt;
    }

    get attempts(): number {
        return this.model.attempts;
    }

    set attempts(value: number) {
        this.model.attempts = value;
    }

    get error(): AnyObject {
        return this.model.error;
    }

    get conflictingTaskId(): TypesIdentifier {
        return this.model.conflictingTaskId;
    }

    set conflictingTaskId(taskId: string) {
        this.model.conflictingTaskId = new Identifier(taskId);
    }

    set error(value: AnyObject) {
        this.model.error = value;
    }

    get erroredAt(): Date | null {
        return this.model.erroredAt;
    }

    set erroredAt(date: Date) {
        this.model.erroredAt = date;
    }

    unlock(): void {
        this.model.locked = false;
        this.model.lockedAt = null;
    }
}