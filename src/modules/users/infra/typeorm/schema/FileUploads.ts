import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity('uploads')
export class FileUploads {
  @PrimaryColumn()
  id: string;

  @Column()
  number: string;

  @Column()
  bookValue: string;

  @Column()
  uf: string;

  @Column()
  productName: string;

  @Column()
  classification: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}
