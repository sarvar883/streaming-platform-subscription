import * as convict from 'convict';
import { WorkerPoolConfigs } from '@infrastructure/worker-pool';
import { SubscriptionId } from '@infrastructure/event-client/kafka';
import { ProcessorConfigs } from '@infrastructure/controllers/processor';
import { TaskServiceConfig } from '@domain/task';

interface DbConnectionCreds {
    dbName: string;
    dbConnectionString: string;
    dbAuthEnabled: boolean;
    dbUsername?: string;
    dbPassword?: string;
    dbAuthSource?: string;
}

export type KafkaTopics = {
    service_on: string;
    service_off: string;
    subscription_enabled: string;
    subscription_disabled: string;
}

interface KafkaConnectionCreds {
    name: string;
    brokers: string[];
    sasl: {
        enabled: boolean;
        mechanism?: string;
        username?: string;
        password?: string;
    };
    ssl: boolean;
    groupId: string;
    topics: KafkaTopics;
    instanceId: SubscriptionId;
}

export type GeneralConfig = {
    env: 'DEVELOPMENT' | 'STAGE' | 'PROD';
    serverPort: number;
    serverHost: string;
    waitBeforeShutDown: number;
    traceKey: string;
    timeout: number;

    setantaDB: DbConnectionCreds;

    paymeDB: DbConnectionCreds;

    kafka: KafkaConnectionCreds;

    fsLogger: {
        dirPath: string;
        requestLoggerFileName: string;
    };

    setanta: {
        endpoint: string;
        bundleId: string;
        apiKey: string;
        timeout: number;
        certificateFileName: string;
        keyFileName: string;
    };

    workerPool: WorkerPoolConfigs;

    processor: ProcessorConfigs;

    taskService: TaskServiceConfig;
}

export const GeneralConfigSchema: convict.Schema<GeneralConfig> = {
    env: {
        default: 'DEVELOPMENT',
        env: 'NODE_ENV',
        format: ['DEVELOPMENT', 'STAGE', 'PROD'],
    },

    serverHost: {
        default: '0.0.0.0',
        env: 'SERVER_HOST',
        format: String,
    },
    serverPort: {
        default: 3000,
        env: 'SERVER_PORT',
        format: Number,
    },
    waitBeforeShutDown: {
        default: 10000,
        env: 'WAIT_BEFORE_SHUTDOWN',
        format: Number,
    },
    traceKey: {
        default: 'traceKey',
        env: 'TRACE_KEY',
        format: String,
    },
    timeout: {
        default: 30000,
        env: 'TIMEOUT',
        format: Number,
    },

    setantaDB: {
        dbName: {
            default: 'ucs',
            env: 'SETANTA_DB_NAME',
            format: String,
        },
        dbConnectionString: {
            default: 'mongodb://127.0.0.1:27017/',
            env: 'SETANTA_DB_CONNECTION_STRING',
            format: String,
        },
        dbAuthEnabled: {
            default: false,
            env: 'SETANTA_DB_AUTH_ENABLED',
            format: Boolean,
            nullable: true,
        },
        dbUsername: {
            default: 'root',
            env: 'SETANTA_DB_USERNAME',
            format: String,
            nullable: true,
        },
        dbPassword: {
            default: 'root',
            env: 'SETANTA_DB_PASSWORD',
            format: String,
            nullable: true,
        },
        dbAuthSource: {
            default: 'admin',
            env: 'SETANTA_DB_AUTH_SOURCE',
            format: String,
            nullable: true,
        },
    },

    paymeDB: {
        dbName: {
            default: 'ucs',
            env: 'PAYME_DB_NAME',
            format: String,
        },
        dbConnectionString: {
            default: 'mongodb://127.0.0.1:27017/',
            env: 'PAYME_DB_CONNECTION_STRING',
            format: String,
        },
        dbAuthEnabled: {
            default: false,
            env: 'PAYME_DB_AUTH_ENABLED',
            format: Boolean,
            nullable: true,
        },
        dbUsername: {
            default: 'root',
            env: 'PAYME_DB_USERNAME',
            format: String,
            nullable: true,
        },
        dbPassword: {
            default: 'root',
            env: 'PAYME_DB_PASSWORD',
            format: String,
            nullable: true,
        },
        dbAuthSource: {
            default: 'admin',
            env: 'PAYME_DB_AUTH_SOURCE',
            format: String,
            nullable: true,
        },
    },

    kafka: {
        name: {
            default: 'ucs',
            env: 'KAFKA_NAME',
            format: String,
        },
        brokers: {
            default: ['localhost:9092'],
            env: 'KAFKA_BROKERS',
            format: Array,
        },
        sasl: {
            mechanism: {
                default: 'plain',
                env: 'KAFKA_SASL_MECHANISM',
                format: String,
                nullable: true,
            },
            username: {
                default: 'root',
                env: 'KAFKA_SASL_USERNAME',
                format: String,
                nullable: true,
            },
            password: {
                default: 'root',
                env: 'KAFKA_SASL_PASSWORD',
                format: String,
                nullable: true,
            },
            enabled: {
                default: false,
                env: 'KAFKA_SASL_ENABLED',
                format: Boolean,
            },
        },
        ssl: {
            default: false,
            env: 'KAFKA_SSL_ENABLED',
            format: Boolean,
        },
        groupId: {
            default: 'ucs-api',
            env: 'KAFKA_GROUP_ID',
            format: String,
        },
        topics: {
            service_on: {
                default: 'subscription.setanta.on',
                env: 'SERVICE_ON_EVENT_NAME',
                format: String,
            },
            service_off: {
                default: 'subscription.setanta.off',
                env: 'SERVICE_OFF_EVENT_NAME',
                format: String,
            },
            subscription_enabled: {
                default: 'subscription.setanta.enabled',
                env: 'SUBSCRIPTION_ENABLED_EVENT_NAME',
                format: String,
            },
            subscription_disabled: {
                default: 'subscription.setanta.disabled',
                env: 'SUBSCRIPTION_DISABLED_EVENT_NAME',
                format: String,
            },
        },
        instanceId: {
            default: 'subscriptionId-1',
            env: 'KAFKA_RETURN_ADDRESS_INSTANCE_ID',
            validate: (value: string) => {
                if (value.split('-')[0] !== 'delayedPayment') throw new Error(`Invalid instance id: ${value}`);
                return value;
            },
        },
    },

    fsLogger: {
        dirPath: {
            default: '/backup/setanta-subscription-service/logs',
            env: 'FS_LOGGER_DIR_PATH',
            format: String,
        },
        requestLoggerFileName: {
            default: 'request_logs.log',
            env: 'REQUEST_LOGGER_FILE_NAME',
            format: String,
        },
    },

    setanta: {
        endpoint: {
            default: 'https://stage.streaming.provider.com',
            env: 'SETANTA_ENDPOINT',
            format: String,
        },
        bundleId: {
            default: '5efc700e-8e1c-442d-92ec-a2b1e2954f55',
            env: 'SETANTA_BUNDLE_ID',
            format: String,
        },
        apiKey: {
            default: '1c3a1b1b-1971-4c92-b07f-6b4ca7085676',
            env: 'SETANTA_API_KEY',
            format: String,
        },
        timeout: {
            default: 10000,
            env: 'SETANTA_REQUEST_TIMEOUT',
            format: Number,
        },
        certificateFileName: {
            default: 'stage_certificate.cert',
            env: 'SETANTA_CERTIFICATE_FILE_NAME',
            format: String,
        },
        keyFileName: {
            default: 'stage_key.key',
            env: 'SETANTA_KEY_FILE_NAME',
            format: String,
        },
    },

    workerPool: {
        filename: {
            default: '../../../app/services/worker/worker.js',
            env: 'WORKER_POOL_FILE_NAME',
            format: String,
        },
        processesCount: {
            default: 5,
            env: 'WORKER_POOL_PROCESSES_COUNT',
            format: Number,
        },
        idleTimeout: {
            default: 2 * 1000,
            env: 'WORKER_POOL_IDLE_TIMEOUT',
            format: Number,
        },
        maxQueue: {
            default: 50,
            env: 'WORKER_POOL_MAX_QUEUE',
            format: Number,
        },
    },

    processor: {
        sleepTimeBetweenTasks: {
            default: 2 * 1000,
            env: 'PROCESSOR_SLEEP_TIME_BETWEEN_TASKS',
            format: Number,
        },
        sleepTimeOnFullQueue: {
            default: 10 * 1000,
            env: 'PROCESSOR_SLEEP_TIME_ON_FULL_QUEUE',
            format: Number,
        },
        sleepTimeOnEmptyQueue: {
            default: 5 * 1000,
            env: 'PROCESSOR_SLEEP_TIME_ON_EMPTY_QUEUE',
            format: Number,
        },
    },

    taskService: {
        debounceTimeAfterCreate: {
            default: 10 * 1000,
            env: 'TASK_SERVICE_DEBOUNCE_TIME_AFTER_CREATE',
            format: Number,
        },
        debounceTimeForRetry: {
            default: 10 * 1000,
            env: 'TASK_SERVICE_DEBOUNCE_TIME_FOR_RETRY',
            format: Number,
        },
    },
}