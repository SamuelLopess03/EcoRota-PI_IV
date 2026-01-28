export interface UpdateProblemReportInputDTO {
  description?: string;
  problemType?: string;
  attachments?: string[];
  subscriberId?: number;
}

export interface UpdateProblemReportOutputDTO {
  id: number;
  protocol: string;
  attachments: string[];
  status: string;
  description: string;
  problemType: string;
  createdAt: Date;
  updatedAt: Date;
  subscriberId: number;
  resolvedByAdminId: number | null;
}
