import { asUniqueArray, generateSymbols } from './helper-types';

export const Symbols = generateSymbols({
    infrastructure: {
        db: asUniqueArray(['setantaDB', 'paymeDB'] as const),
        common: asUniqueArray(['logger', 'localization', 'customDate'] as const),
        config: asUniqueArray(['appdynamics', 'general'] as const),
        controllers: asUniqueArray(['Processor', 'TaskProcessor'] as const),
        worker: asUniqueArray(['WorkerPool'] as const),
        storage: asUniqueArray(['asyncStorage'] as const),
        kafka: asUniqueArray(['kafkaClient', 'kafkaProducer', 'keyGenerator'] as const),
        loggers: asUniqueArray(['requestLogger'] as const),
        setantaClient: asUniqueArray(['setantaClient'] as const),
        queue: asUniqueArray(['DbQueue'] as const),
        taskRecovery: asUniqueArray(['taskRecoveryService'] as const),
        conflictingTasksResolver: asUniqueArray(['service'] as const),
        strategies: asUniqueArray(['chooseUseCaseStrategy'] as const),
    },
    domain: {
        setantaUsers: asUniqueArray(['setantaUsersService', 'setantaUsersRepository', 'setantaUsersSchema'] as const),
        setantaActivations: asUniqueArray(['activationsService', 'activationsRepository', 'activationsSchema'] as const),
        setantaClient: asUniqueArray(['setantaClientService'] as const),
        stateHistory: asUniqueArray(['stateHistoryService', 'stateHistoryRepository', 'stateHistorySchema'] as const),
        setantaService: asUniqueArray(['setantaService', 'setantaRepository'] as const),
        paymeUsers: asUniqueArray(['paymeUsersService', 'paymeUsersRepository', 'paymeUsersSchema'] as const),
        task: asUniqueArray(['taskService', 'taskRepository', 'taskSchema'] as const),
    },
    useCases: asUniqueArray([
        'EventHandle',
        'SubscriptionActivate',
        'SubscriptionCancel',
    ] as const),
} as const);