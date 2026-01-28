import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { HashProvider } from "../../../domain/providers/HashProvider.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { 
  CreateAdministratorInputDTO, 
  CreateAdministratorOutputDTO 
} from "../../dtos/administrator/CreateAdministratorDTO.js";

/**
 * @class CreateAdministratorUseCase
 * @description Caso de uso responsável por cadastrar um novo administrador no sistema.
 */
export class CreateAdministratorUseCase {
  constructor(
    private administratorRepository: AdministratorRepository,
    private hashProvider: HashProvider
  ) { }

  /**
   * Executa a lógica de criação de um administrador.
   * @param input Dados de entrada (nome, e-mail e senha).
   * @returns DTO com os dados do administrador criado.
   * @throws {ConflictError} Se o e-mail já estiver em uso.
   * @throws {InvalidEmailError} Se o formato do e-mail for inválido.
   * @throws {HashingError} Se ocorrer uma falha ao gerar o hash da senha.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na persistência dos dados.
   */
  async execute(input: CreateAdministratorInputDTO): Promise<CreateAdministratorOutputDTO> {
    const emailVO = new Email(input.email);

    const hashedPassword = await this.hashProvider.generateHash(input.password);

    const administrator = await this.administratorRepository.create({
      name: input.name,
      email: emailVO,
      password: hashedPassword
    });

    return {
      id: administrator.id,
      name: administrator.name,
      email: administrator.email.getValue(),
      createdAt: administrator.createdAt,
      updatedAt: administrator.updatedAt
    };
  }
}
