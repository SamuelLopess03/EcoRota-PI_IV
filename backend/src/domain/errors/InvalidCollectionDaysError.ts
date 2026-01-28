export class InvalidCollectionDaysError extends Error {
    constructor(message: string) {
        super(`Dias de coleta inválidos: ${message}`);
        this.name = "InvalidCollectionDaysError";
    }
}
