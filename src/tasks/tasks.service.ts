import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}
    public async getAllTasks(): Promise<Task[]> {
        return await this.tasksRepository.find();
    }

    public async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: {
                id,
            },
        });
        if (!found) {
            throw new NotFoundException(`Task with ID"${id}" not found`);
        }

        return found;
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.tasksRepository.save(task);
        return task;
    }

    public async deleteTask(id: string): Promise<void> {
        const res = await this.tasksRepository.delete(id);
        if (!res.affected) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    public async updateTask(
        id: string,
        updateStatusDto: UpdateStatusDto,
    ): Promise<Task> {
        const task = await this.getTaskById(id);
        const { status } = updateStatusDto;
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

    public async getTasks(filterData: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterData;
        const query = this.tasksRepository.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere(
                'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search',
                { search: `%${search}%` },
            );
        }
        const tasks = await query.getMany();
        return tasks;
    }
}
