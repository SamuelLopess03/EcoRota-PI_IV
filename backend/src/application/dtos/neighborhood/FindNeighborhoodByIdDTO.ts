export interface FindNeighborhoodByIdOutputDTO {
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
