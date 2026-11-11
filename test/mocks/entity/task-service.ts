import { Task, Instruction } from '@domain/task';

export const mockedTasksWithConflicts: Task[] = [
    new Task({
        id: '1',
        userId: '23',
        subscriptionId: 'some_random_id',
        instruction: Instruction.On,
        processTime: new Date('2024-10-06 16:38:03'),
    } as any),
    new Task({
        id: '2',
        userId: '24',
        subscriptionId: 'some_random_id',
        instruction: Instruction.On,
        processTime: new Date('2024-10-06 16:38:04'),
    } as any),
    new Task({
        id: '3',
        userId: '23',
        subscriptionId: 'some_random_id',
        instruction: Instruction.Off,
        processTime: new Date('2024-10-06 16:34:51'),
    } as any),
    new Task({
        id: '4',
        userId: '25',
        subscriptionId: 'some_random_id',
        instruction: Instruction.Off,
        processTime: new Date('2024-10-06 16:31:08'),
    } as any),
    new Task({
        id: '5',
        userId: '26',
        subscriptionId: 'some_random_id',
        instruction: Instruction.Off,
        processTime: new Date('2024-10-06 16:22:48'),
    } as any),
    new Task({
        id: '4',
        userId: '25',
        subscriptionId: 'some_random_id',
        instruction: Instruction.On,
        processTime: new Date('2024-10-06 16:18:01'),
    } as any),
];

export const mockedTasksWithoutConflicts: Task[] = [
    new Task({
        id: '1',
        userId: '23',
        subscriptionId: 'some_random_id',
        instruction: Instruction.On,
        processTime: new Date('2024-10-06 16:38:03'),
    } as any),
    new Task({
        id: '2',
        userId: '24',
        subscriptionId: 'some_random_id',
        instruction: Instruction.On,
        processTime: new Date('2024-10-06 16:38:04'),
    } as any),
    new Task({
        id: '3',
        userId: '23',
        subscriptionId: 'some_random_id',
        instruction: Instruction.Off,
        processTime: new Date('2024-10-06 16:34:51'),
    } as any),
];