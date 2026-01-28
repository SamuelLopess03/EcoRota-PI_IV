export interface FindRouteByIdOutputDTO {
  id: number;
  name: string;
  collectionDays: string[];
  collectionDaysLocalized: string;
  startTime: string;
  endTime: string;
  collectionType: string;
  neighborhoods: {
    id: number;
    name: string;
    postalCode: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  adminIdCreated: number;
  adminIdUpdated: number | null;
}
