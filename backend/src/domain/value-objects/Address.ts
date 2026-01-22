import { InvalidAddressError } from "../errors/InvalidAddressError.js";

export interface AddressProps {
    street: string;
    number?: string;
    complement?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

export class Address {
    private readonly street: string;
    private readonly number?: string;
    private readonly complement?: string;
    private readonly postalCode?: string;
    private readonly latitude?: number;
    private readonly longitude?: number;

    constructor(props: AddressProps) {
        this.validate(props);

        this.street = props.street.trim();
        this.number = props.number?.trim();
        this.complement = props.complement?.trim();
        this.postalCode = props.postalCode?.trim();
        this.latitude = props.latitude;
        this.longitude = props.longitude;
    }

    private validate(props: AddressProps): void {
        // Validar rua obrigatória
        if (!props.street || props.street.trim().length === 0) {
            throw new InvalidAddressError("A rua é obrigatória");
        }

        // Validar número obrigatório
        if (!props.number || props.number.trim().length === 0) {
            throw new InvalidAddressError("O número é obrigatório");
        }

        // Validar coordenadas se presentes
        if (props.latitude !== undefined) {
            if (!this.isValidLatitude(props.latitude)) {
                throw new InvalidAddressError(
                    `Latitude inválida: ${props.latitude}. Deve estar entre -90 e 90`
                );
            }
        }

        if (props.longitude !== undefined) {
            if (!this.isValidLongitude(props.longitude)) {
                throw new InvalidAddressError(
                    `Longitude inválida: ${props.longitude}. Deve estar entre -180 e 180`
                );
            }
        }

        // Se uma coordenada está presente, a outra também deve estar
        if (
            (props.latitude !== undefined && props.longitude === undefined) ||
            (props.latitude === undefined && props.longitude !== undefined)
        ) {
            throw new InvalidAddressError(
                "Latitude e longitude devem ser fornecidas juntas"
            );
        }
    }

    private isValidLatitude(lat: number): boolean {
        return lat >= -90 && lat <= 90;
    }

    private isValidLongitude(lng: number): boolean {
        return lng >= -180 && lng <= 180;
    }

    // Getters para acessar os valores (imutabilidade)
    public getStreet(): string {
        return this.street;
    }

    public getNumber(): string | undefined {
        return this.number;
    }

    public getComplement(): string | undefined {
        return this.complement;
    }

    public getPostalCode(): string | undefined {
        return this.postalCode;
    }

    public getLatitude(): number | undefined {
        return this.latitude;
    }

    public getLongitude(): number | undefined {
        return this.longitude;
    }

    // Método para obter endereço completo como string
    public getFullAddress(): string {
        let address = `${this.street}, ${this.number}`;

        if (this.complement) {
            address += `, ${this.complement}`;
        }

        if (this.postalCode) {
            address += ` - CEP: ${this.postalCode}`;
        }

        return address;
    }

    // Método para verificar se tem coordenadas
    public hasCoordinates(): boolean {
        return this.latitude !== undefined && this.longitude !== undefined;
    }

    // Método equals para comparar dois endereços
    public equals(other: Address): boolean {
        if (!(other instanceof Address)) {
            return false;
        }

        return (
            this.street === other.street &&
            this.number === other.number &&
            this.complement === other.complement &&
            this.postalCode === other.postalCode &&
            this.latitude === other.latitude &&
            this.longitude === other.longitude
        );
    }

    // Método para criar uma cópia com alterações (mantém imutabilidade)
    public withChanges(changes: Partial<AddressProps>): Address {
        return new Address({
            street: changes.street ?? this.street,
            number: changes.number ?? this.number,
            complement: changes.complement ?? this.complement,
            postalCode: changes.postalCode ?? this.postalCode,
            latitude: changes.latitude ?? this.latitude,
            longitude: changes.longitude ?? this.longitude,
        });
    }
}
