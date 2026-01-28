import { SubscriberRepository } from "../../../domain/repositories/SubscriberRepository.js";

/**
 * @class UnsubscribeUseCase
 * @description Caso de uso responsável por remover a assinatura de um cidadão.
 */
export class UnsubscribeUseCase {
  constructor(private subscriberRepository: SubscriberRepository) { }

  /**
   * Executa a remoção.
   * @param id ID do assinante.
   * @throws {EntityNotFoundError} Se não existir.
   * @throws {PersistenceError} Se houver um erro na persistência.
   */
  async execute(id: number): Promise<void> {
    await this.subscriberRepository.delete(id);
  }
}
