export interface TokenProvider {
  /**
   * Gera um token assinado com o payload fornecido.
   * @param payload Os dados a serem codificados no token.
   * @param expiresIn Sobrescrita opcional para a expiração do token (ex: '7d', '24h').
   * @throws {SecurityError} Se ocorrer um erro técnico na geração do token.
   */
  generate(payload: object, expiresIn?: string): string;

  /**
   * Verifica um token e retorna seu payload decodificado.
   * @param token A string do token para verificar.
   * @throws {InvalidTokenError} Se o token for inválido ou estiver expirado.
   * @throws {SecurityError} Se ocorrer um erro técnico na validação do token.
   */
  verify<T extends object>(token: string): T;
}
