/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;
}
