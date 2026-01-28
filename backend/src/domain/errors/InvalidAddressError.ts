export class InvalidAddressError extends Error {
    constructor(message: string) {
        super(`Endereço inválido: ${message}`);
        this.name = "InvalidAddressError";
    }
}
