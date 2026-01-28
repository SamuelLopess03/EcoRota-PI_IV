export class InvalidAcceptedMaterialsError extends Error {
    constructor(message: string) {
        super(`Materiais aceitos inválidos: ${message}`);
        this.name = "InvalidAcceptedMaterialsError";
    }
}
