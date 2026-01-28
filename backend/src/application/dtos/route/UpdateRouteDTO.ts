export interface UpdateRouteInputDTO {
  name?: string;
  collectionDays?: string[];
  startTime?: string;
  endTime?: string;
  collectionType?: string;
  adminId: number;
}

export interface UpdateRouteOutputDTO {
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
