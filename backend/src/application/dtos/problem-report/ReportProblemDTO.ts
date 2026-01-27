export interface ReportProblemInputDTO {
  description: string;
  problemType: string;
  attachments: string[];
  subscriberId: number;
}

export interface ReportProblemOutputDTO {
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
