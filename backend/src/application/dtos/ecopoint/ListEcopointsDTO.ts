export interface ListEcopointsOutputDTO {
  id: number;
  name: string;
  materials: string[];
  materialsLocalized: string;
  street: string;
  number?: string;
  complement?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  collectionDays: string[];
  collectionDaysLocalized: string;
  startTime: string;
  endTime: string;
  neighborhoodId: number;
  createdAt: Date;
  updatedAt: Date;
  adminIdCreated: number;
  adminIdUpdated: number | null;
}
