import { TaskService } from '@domain/task';
import { mockedTasksWithConflicts, mockedTasksWithoutConflicts } from '../mocks/entity/task-service';

describe('ConflictingTasksResolverService', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = {
            getById: jest.fn(),
            create: jest.fn(),
            changeState: jest.fn(),
            getCurrentTasks: jest.fn(),
            getNext: jest.fn(),
            getForRecovery: jest.fn(),
            getForProcessing: jest.fn(),
            count: jest.fn(),
        };
    });

    describe('resolveConflictingTasks', () => {
        it('should do nothing if tasks are not found', () => {
            taskService.getCurrentTasks = jest.fn().mockReturnValue([]);

            expect(taskService.changeState).not.toHaveBeenCalled();
        });

        it('should not change task states if conflicting tasks are not found', () => {
            taskService.getCurrentTasks = jest.fn().mockReturnValue(mockedTasksWithoutConflicts);

            expect(taskService.changeState).not.toHaveBeenCalled();
        });

        it('should change task states if conflicting tasks are found', () => {
            taskService.getCurrentTasks = jest.fn().mockReturnValue(mockedTasksWithConflicts);

            expect(taskService.changeState).toHaveBeenCalled();
            expect(taskService.changeState).toHaveBeenCalledTimes(2);
        });
    });
});