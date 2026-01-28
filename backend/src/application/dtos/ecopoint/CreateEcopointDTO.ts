export interface CreateEcopointInputDTO {
  name: string;
  partnerName?: string;
  materials: string[];
  latitude: number;
  longitude: number;
  collectionDays: string[];
  startTime: string;
  endTime: string;
  neighborhoodId: number;
  adminId: number;
}

export interface CreateEcopointOutputDTO {
  id: number;
  name: string;
  partnerName: string | null;
  materials: string[];
  materialsLocalized: string;
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
