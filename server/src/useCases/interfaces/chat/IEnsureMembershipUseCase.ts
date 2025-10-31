export interface IEnsureMembershipUseCase {
    execute(userId: string, roomId: string): Promise<void>;
}
