export interface WorkerParams {
    taskId: string;
    traceId?: string;
    threadId?: string;
}

export interface WorkerPool {
    run(taskId: string): Promise<any>;
    acceptsTasks(): boolean;
}