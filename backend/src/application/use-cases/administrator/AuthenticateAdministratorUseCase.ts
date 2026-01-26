import { AdministratorRepository } from "../../../domain/repositories/AdministratorRepository.js";
import { HashProvider } from "../../../domain/providers/HashProvider.js";
import { TokenProvider } from "../../../domain/providers/TokenProvider.js";
import { Email } from "../../../domain/value-objects/Email.js";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError.js";
import { 
  AuthenticateAdministratorInputDTO, 
  AuthenticateAdministratorOutputDTO 
} from "../../dtos/administrator/AuthenticateAdministratorDTO.js";

/**
 * @class AuthenticateAdministratorUseCase
 * @description Caso de uso responsável por autenticar um administrador e gerar um token de acesso.
 */
export class AuthenticateAdministratorUseCase {
  constructor(
    private administratorRepository: AdministratorRepository,
    private hashProvider: HashProvider,
    private tokenProvider: TokenProvider
  ) { }

  /**
   * Executa a lógica de autenticação.
   * @param input Credenciais de acesso (e-mail e senha).
   * @returns DTO contendo os dados básicos do admin e o token gerado.
   * @throws {InvalidCredentialsError} Se o e-mail não existir ou a senha for incorreta.
   * @throws {InvalidEmailError} Se o formato do e-mail fornecido for inválido.
   * @throws {HashingError} Se ocorrer uma falha técnica na comparação do hash.
   * @throws {ProviderError} Se ocorrer uma falha técnica na geração do token.
   * @throws {PersistenceError} Se ocorrer uma falha técnica na busca do administrador.
   */
  async execute(input: AuthenticateAdministratorInputDTO): Promise<AuthenticateAdministratorOutputDTO> {
    const emailVO = new Email(input.email);
    
    const administrator = await this.administratorRepository.findByEmail(emailVO);

    if (!administrator) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await this.hashProvider.compareHash(
      input.password,
      administrator.password
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenProvider.generate({
      sub: administrator.id,
      email: administrator.email.getValue(),
      name: administrator.name
    });

    return {
      administrator: {
        id: administrator.id,
        name: administrator.name,
        email: administrator.email.getValue()
      },
      token
    };
  }
}
