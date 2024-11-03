import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, CreateRelationshipDto } from './employees.types';

@Controller('api')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('org')
  async getOrganization() {
    try {
      const [employees, relationships] = await Promise.all([
        this.employeesService.getAllEmployees(),
        this.employeesService.getAllRelationships(),
      ]);
      return { employees, relationships };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch organization data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('employees')
  async upsertEmployee(@Body() employee: CreateEmployeeDto) {
    try {
      const result = await this.employeesService.upsertEmployee(employee);
      return { success: true, id: result.id };
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('employees/:id')
  async deleteEmployee(@Param('id') id: string) {
    try {
      await this.employeesService.deleteEmployee(id);
      return { success: true };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('relationships')
  async upsertRelationship(@Body() relationship: CreateRelationshipDto) {
    try {
      const result = await this.employeesService.upsertRelationship(relationship);
      return { success: true, id: result.id };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('relationships/:id')
  async deleteRelationship(@Param('id') id: string) {
    try {
      await this.employeesService.deleteRelationship(id);
      return { success: true };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}