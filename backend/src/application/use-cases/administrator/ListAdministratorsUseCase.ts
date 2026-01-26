import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { ListAdministratorsOutputDTO } from "../../dtos/administrator/ListAdministratorsDTO.js";

/**
 * @class ListAdministratorsUseCase
 * @description Caso de uso responsável por listar todos os administradores cadastrados no sistema.
 */
export class ListAdministratorsUseCase {
  constructor(private administratorRepository: AdministratorRepository) { }

  /**
   * Executa a lógica de listagem.
   * @returns Uma lista de DTOs com os dados dos administradores.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência.
   */
  async execute(): Promise<ListAdministratorsOutputDTO[]> {
    const administrators = await this.administratorRepository.findAll();

    return administrators.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email.getValue(),
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }));
  }
}
