export interface CreateAdministratorInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateAdministratorOutputDTO {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
