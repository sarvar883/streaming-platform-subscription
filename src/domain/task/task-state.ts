import { Stateful, StateRules } from '@domain/state-history/stateful';

export enum TaskState {
    Created = 'created',
    QueuedForProcessing = 'queued_for_processing',
    Processing = 'processing',
    QueuedForRetrying = 'queued_for_retrying',
    Redundant = 'redundant',
    Completed = 'completed',
    Error = 'error',
}

export const taskRules: StateRules<TaskState> = {
    [TaskState.Created]: [TaskState.QueuedForProcessing, TaskState.Redundant],
    [TaskState.QueuedForProcessing]: [TaskState.QueuedForRetrying, TaskState.Processing],
    [TaskState.Processing]: [TaskState.Completed, TaskState.QueuedForRetrying, TaskState.Error],
    [TaskState.QueuedForRetrying]: [TaskState.QueuedForProcessing],
    [TaskState.Redundant]: [],
    [TaskState.Completed]: [],
    [TaskState.Error]: [],
} as const;