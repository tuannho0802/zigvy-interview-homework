/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  create(dto: CreateTaskDto, user: User) {
    const task = this.taskRepo.create({ ...dto, user });
    return this.taskRepo.save(task);
  }

  findAll(user: User) {
    return this.taskRepo.find({ where: { user } });
  }

  update(id: number, dto: UpdateTaskDto, user: User) {
    return this.taskRepo.update({ id, user }, dto);
  }

  delete(id: number, user: User) {
    return this.taskRepo.delete({ id, user });
  }
}
