import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './models/employee.model';
import { Relationship } from './models/relationship.model';

@Module({
  imports: [SequelizeModule.forFeature([Employee, Relationship])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}