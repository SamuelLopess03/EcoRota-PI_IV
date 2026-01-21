import { InvalidAddressError } from "../errors/InvalidAddressError.js";
import { PostalCode } from "./PostalCode.js";

export interface AddressProps {
    street: string;
    number: string;
    complement?: string;
    postalCode?: PostalCode;
    latitude?: number;
    longitude?: number;
}

export class Address {
    private readonly street: string;
    private readonly number: string;
    private readonly complement?: string;
    private readonly postalCode?: PostalCode;
    private readonly latitude?: number;
    private readonly longitude?: number;

    constructor(props: AddressProps) {
        this.validate(props);

        this.street = props.street.trim();
        this.number = props.number.trim();
        this.complement = props.complement?.trim();
        this.postalCode = props.postalCode;
        this.latitude = props.latitude;
        this.longitude = props.longitude;
    }

    private validate(props: AddressProps): void {
        if (!props.street || props.street.trim().length === 0) {
            throw new InvalidAddressError("A rua é obrigatória");
        }
        if (!props.number || props.number.trim().length === 0) {
            throw new InvalidAddressError("O número é obrigatório");
        }

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

    public getStreet(): string {
        return this.street;
    }

    public getNumber(): string {
        return this.number;
    }

    public getComplement(): string | undefined {
        return this.complement;
    }

    public getPostalCode(): PostalCode | undefined {
        return this.postalCode;
    }

    public getLatitude(): number | undefined {
        return this.latitude;
    }

    public getLongitude(): number | undefined {
        return this.longitude;
    }

    public getFullAddress(): string {
        let address = `${this.street}, ${this.number}`;

        if (this.complement) {
            address += `, ${this.complement}`;
        }

        if (this.postalCode) {
            address += ` - CEP: ${this.postalCode.getFormatted()}`;
        }

        return address;
    }

    public hasCoordinates(): boolean {
        return this.latitude !== undefined && this.longitude !== undefined;
    }
    public equals(other: Address): boolean {
        if (!(other instanceof Address)) {
            return false;
        }

        const postalCodeEquals =
            (this.postalCode === undefined && other.postalCode === undefined) ||
            (this.postalCode !== undefined && other.postalCode !== undefined && this.postalCode.equals(other.postalCode));

        return (
            this.street === other.street &&
            this.number === other.number &&
            this.complement === other.complement &&
            postalCodeEquals &&
            this.latitude === other.latitude &&
            this.longitude === other.longitude
        );
    }

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
