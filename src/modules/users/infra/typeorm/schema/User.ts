import { v4 as uuid } from 'uuid';

export class User {
  id: string;

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

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
