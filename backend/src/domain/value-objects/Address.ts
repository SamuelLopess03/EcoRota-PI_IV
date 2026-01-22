import { InvalidAddressError } from "../errors/InvalidAddressError.js";
import { GeoLocation } from "./GeoLocation.js";

export interface AddressProps {
    street: string;
    number?: string;
    complement?: string;
    postalCode?: string;
    geoLocation?: GeoLocation;
}

export class Address {
    private readonly street: string;
    private readonly number?: string;
    private readonly complement?: string;
    private readonly postalCode?: string;
    private readonly geoLocation?: GeoLocation;

    constructor(props: AddressProps) {
        this.validate(props);

        this.street = props.street.trim();
        this.number = props.number?.trim();
        this.complement = props.complement?.trim();
        this.postalCode = props.postalCode?.trim();
        this.geoLocation = props.geoLocation;
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

    public getGeoLocation(): GeoLocation | undefined {
        return this.geoLocation;
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
    public hasGeoLocation(): boolean {
        return this.geoLocation !== undefined;
    }

    // Método equals para comparar dois endereços
    public equals(other: Address): boolean {
        if (!(other instanceof Address)) {
            return false;
        }

        const geoLocationEquals = 
            (this.geoLocation === undefined && other.geoLocation === undefined) ||
            (this.geoLocation !== undefined && other.geoLocation !== undefined && this.geoLocation.equals(other.geoLocation));

        return (
            this.street === other.street &&
            this.number === other.number &&
            this.complement === other.complement &&
            this.postalCode === other.postalCode &&
            geoLocationEquals
        );
    }

    // Método para criar uma cópia com alterações (mantém imutabilidade)
    public withChanges(changes: Partial<AddressProps>): Address {
        return new Address({
            street: changes.street ?? this.street,
            number: changes.number ?? this.number,
            complement: changes.complement ?? this.complement,
            postalCode: changes.postalCode ?? this.postalCode,
            geoLocation: changes.geoLocation ?? this.geoLocation,
        });
    }
}
