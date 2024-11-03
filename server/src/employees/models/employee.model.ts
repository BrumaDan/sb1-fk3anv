import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Relationship } from './relationship.model';

@Table
export class Employee extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  position: string;

  @Column
  department: string;

  @Column
  email: string;

  @Column
  imageUrl: string;

  @HasMany(() => Relationship, 'source')
  managedEmployees: Relationship[];

  @HasMany(() => Relationship, 'target')
  managers: Relationship[];
}