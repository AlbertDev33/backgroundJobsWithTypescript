export interface ICreateUserDTO {
  id?: string;
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
}
