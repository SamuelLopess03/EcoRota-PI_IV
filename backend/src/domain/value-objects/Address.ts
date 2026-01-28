import { InvalidAddressError } from "../errors/InvalidAddressError.js";
import { PostalCode } from "./PostalCode.js";
import { GeoLocation } from "./GeoLocation.js";

export interface AddressProps {
    street: string;
    number?: string;
    complement?: string;
    postalCode?: PostalCode;
    geoLocation?: GeoLocation;
}

export class Address {
    private readonly street: string;
    private readonly number?: string;
    private readonly complement?: string;
    private readonly postalCode?: PostalCode;
    private readonly geoLocation?: GeoLocation;

    constructor(props: AddressProps) {
        this.validate(props);

        this.street = props.street.trim();
        this.number = props.number?.trim();
        this.complement = props.complement?.trim();
        this.postalCode = props.postalCode;
        this.geoLocation = props.geoLocation;
    }

    private validate(props: AddressProps): void {
        if (!props.street || props.street.trim().length === 0) {
            throw new InvalidAddressError("A rua é obrigatória");
        }
    }

    public getStreet(): string {
        return this.street;
    }

    public getNumber(): string | undefined {
        return this.number;
    }

    public getComplement(): string | undefined {
        return this.complement;
    }

    public getPostalCode(): PostalCode | undefined {
        return this.postalCode;
    }

    public getGeoLocation(): GeoLocation | undefined {
        return this.geoLocation;
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
  
    public hasGeoLocation(): boolean {
        return this.geoLocation !== undefined;
    }
  
    public equals(other: Address): boolean {
        if (!(other instanceof Address)) {
            return false;
        }

        const postalCodeEquals =
            (this.postalCode === undefined && other.postalCode === undefined) ||
            (this.postalCode !== undefined && other.postalCode !== undefined && this.postalCode.equals(other.postalCode));
      
        const geoLocationEquals = 
            (this.geoLocation === undefined && other.geoLocation === undefined) ||
            (this.geoLocation !== undefined && other.geoLocation !== undefined && this.geoLocation.equals(other.geoLocation));

        return (
            this.street === other.street &&
            this.number === other.number &&
            this.complement === other.complement &&
            postalCodeEquals &&
            geoLocationEquals
        );
    }

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
