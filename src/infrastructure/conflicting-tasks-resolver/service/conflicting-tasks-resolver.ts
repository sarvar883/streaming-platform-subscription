import { Task, TaskService, TaskState, Instruction } from '@domain/task';

export interface ConflictingTasksResolver {
    resolveConflictingTasks(): Promise<void>;
}

export class ConflictingTasksResolverImpl implements ConflictingTasksResolver {
    constructor(
        private readonly taskService: TaskService,
    ) {}

    async resolveConflictingTasks(): Promise<void> {
        console.log('[ConflictingTasksResolver] executed');

        try {
            const tasks: Task[] = await this.taskService.getCurrentTasks();

            if (!tasks || tasks.length === 0) {
                console.log('[ConflictingTasksResolver] No Tasks');
                return;
            }
            console.log('[ConflictingTasksResolver] Tasks found length =', tasks.length);

            // Map to track tasks by userId and instruction
            const taskMap = new Map<string, Map<Instruction, Task>>();

            for (const task of tasks) {
                const userId = task.userId;

                if (!taskMap.has(userId)) {
                    taskMap.set(userId, new Map());
                }

                const instruction: Instruction = task.instruction;
                const opposingInstruction: Instruction | null = this.getOpposingInstruction(instruction);

                if (!opposingInstruction) {
                    continue;
                }

                const userTasks: Map<Instruction, Task> = taskMap.get(userId);

                if (!userTasks.has(opposingInstruction)) {
                    // No conflict found, add task to map
                    userTasks.set(instruction, task);

                    continue;
                }

                // Conflict found with existing task
                const conflictingTask: Task = userTasks.get(opposingInstruction);
                console.log('[ConflictingTasksResolver] conflict found', task.id, conflictingTask.id);

                // Mark both tasks as redundant
                await this.taskService.changeState(task, TaskState.Redundant, { conflictingTaskId: conflictingTask.id });
                await this.taskService.changeState(conflictingTask, TaskState.Redundant, { conflictingTaskId: task.id });

                // Remove the conflicting task from the map
                taskMap.delete(userId);
            }

            console.log('[ConflictingTasksResolver] finished');

        } catch (e) {
            console.log('[ConflictingTasksResolver] catch e =', e);
        }
    }

    private getOpposingInstruction(instruction: Instruction): Instruction {
        if (instruction === Instruction.On) {
            return Instruction.Off;
        }

        if (instruction === Instruction.Off) {
            return Instruction.On;
        }

        return null;
    }
}