import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Employee } from './models/employee.model';
import { Relationship } from './models/relationship.model';
import { CreateEmployeeDto, CreateRelationshipDto } from './employees.types';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
    @InjectModel(Relationship)
    private relationshipModel: typeof Relationship,
  ) {}

  async getAllEmployees(): Promise<Employee[]> {
    try {
      return await this.employeeModel.findAll({
        include: [
          { model: Relationship, as: 'managedEmployees' },
          { model: Relationship, as: 'managers' },
        ],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch employees');
    }
  }

  async getAllRelationships(): Promise<Relationship[]> {
    try {
      return await this.relationshipModel.findAll({
        include: [
          { model: Employee, as: 'sourceEmployee' },
          { model: Employee, as: 'targetEmployee' },
        ],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch relationships');
    }
  }

  async upsertEmployee(employeeData: CreateEmployeeDto): Promise<Employee> {
    try {
      const [employee, created] = await this.employeeModel.upsert(employeeData, {
        returning: true,
      });

      if (!employee) {
        throw new BadRequestException('Failed to create/update employee');
      }

      return employee;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upsert employee: ${error.message}`);
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    const transaction = await this.employeeModel.sequelize.transaction();

    try {
      const employee = await this.employeeModel.findByPk(id);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Delete related relationships first
      await this.relationshipModel.destroy({
        where: {
          [Op.or]: [{ source: id }, { target: id }],
        },
        transaction,
      });

      // Delete the employee
      await employee.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete employee: ${error.message}`);
    }
  }

  async upsertRelationship(relationshipData: CreateRelationshipDto): Promise<Relationship> {
    const transaction = await this.relationshipModel.sequelize.transaction();

    try {
      // Check if both employees exist
      const [source, target] = await Promise.all([
        this.employeeModel.findByPk(relationshipData.source),
        this.employeeModel.findByPk(relationshipData.target),
      ]);

      if (!source || !target) {
        throw new NotFoundException('Source or target employee not found');
      }

      // Check for circular relationships
      if (relationshipData.source === relationshipData.target) {
        throw new BadRequestException('Cannot create self-referential relationship');
      }

      const [relationship, created] = await this.relationshipModel.upsert(
        relationshipData,
        {
          returning: true,
          transaction,
        },
      );

      await transaction.commit();
      return relationship;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upsert relationship: ${error.message}`);
    }
  }

  async deleteRelationship(id: string): Promise<void> {
    try {
      const relationship = await this.relationshipModel.findByPk(id);
      if (!relationship) {
        throw new NotFoundException(`Relationship with ID ${id} not found`);
      }

      await relationship.destroy();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete relationship: ${error.message}`);
    }
  }
}