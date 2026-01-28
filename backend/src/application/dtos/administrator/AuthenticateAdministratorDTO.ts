export interface AuthenticateAdministratorInputDTO {
  email: string;
  password: string;
}

export interface AuthenticateAdministratorOutputDTO {
  administrator: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}
