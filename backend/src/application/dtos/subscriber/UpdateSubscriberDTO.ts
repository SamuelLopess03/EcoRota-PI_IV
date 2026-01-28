export interface UpdateSubscriberInputDTO {
  email?: string;
  street?: string;
  number?: string;
  complement?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  neighborhoodId?: number;
}

export interface UpdateSubscriberOutputDTO {
  id: number;
  email: string;
  street: string;
  number?: string;
  complement?: string;
  postalCode?: string;
  postalCodeFormatted?: string;
  latitude?: number;
  longitude?: number;
  neighborhoodId: number;
  createdAt: Date;
  updatedAt: Date;
}
