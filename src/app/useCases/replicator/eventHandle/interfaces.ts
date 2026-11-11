import { UseCase } from '@domain/_core';
import { EventHandleUseCaseInput } from '@infrastructure/controllers/replicator';

export interface EventHandleUseCase extends UseCase<EventHandleUseCaseInput, void> {}