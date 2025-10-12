export interface ITransactionManager<SessionType = unknown> {
    runInTransaction<T>(callback: (session: SessionType) => Promise<T>): Promise<T>;
}