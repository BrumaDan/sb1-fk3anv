import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table
export class Relationship extends Model {
  @Column({ primaryKey: true })
  id: string;

  @ForeignKey(() => Employee)
  @Column
  source: string;

  @ForeignKey(() => Employee)
  @Column
  target: string;

  @BelongsTo(() => Employee, 'source')
  sourceEmployee: Employee;

  @BelongsTo(() => Employee, 'target')
  targetEmployee: Employee;
}