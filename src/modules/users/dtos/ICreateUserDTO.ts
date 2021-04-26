export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: string;
  street: string;
  district: string;
  homeNumber: number;
  city: string;
  state: string;
  country: string;
  token: string;
  confirmation: boolean;
}
