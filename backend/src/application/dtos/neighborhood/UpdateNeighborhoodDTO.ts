export interface UpdateNeighborhoodInputDTO {
  name?: string;
  populationEstimate?: number | null;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  routeId?: number;
  adminId: number; // ID do administrador que está realizando a alteração
}

export interface UpdateNeighborhoodOutputDTO {
  id: number;
  name: string;
  populationEstimate: number | null;
  postalCode: string;
  postalCodeFormatted: string;
  latitude: number;
  longitude: number;
  routeId: number;
  adminIdCreated: number;
  adminIdUpdated: number | null;
  createdAt: Date;
  updatedAt: Date;
}
