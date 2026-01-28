export interface ListRoutesOutputDTO {
  id: number;
  name: string;
  collectionDays: string[];
  collectionDaysLocalized: string;
  startTime: string;
  endTime: string;
  collectionType: string;
  createdAt: Date;
  updatedAt: Date;
  adminIdCreated: number;
  adminIdUpdated: number | null;
}
