export interface IHandleWebhookUseCase {
  execute(payload: Buffer, signature: string, endpointSecret: string): Promise<void>;
}
