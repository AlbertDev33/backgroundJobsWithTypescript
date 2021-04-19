export interface ICreateUserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: number;
  street: string;
  district: string;
  homeNumber: number;
  city: string;
  state: string;
  country: string;
}
