import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    public getAllTasks(): Task[] {
        return this.tasks;
    }

    public getTaskById(id: string): Task {
        const found = this.tasks.find((item) => item.id == id);
        if (!found) {
            throw new NotFoundException('Task with ID not found');
        } else {
            return found;
        }
    }

    public createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);

        return task;
    }

    public deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    public updateTask(id: string, updateStatusDto: UpdateStatusDto): Task {
        const task = this.getTaskById(id);
        const { status } = updateStatusDto;
        task.status = status;
        return task;
    }

    public getTasksWithFilters(filterData: GetTasksFilterDto): Task[] {
        const { status, search } = filterData;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter((task) => task.status == status);
        }
        if (search) {
            tasks = tasks.filter((task) => {
                if (
                    task.title.toLowerCase().includes(search.toLowerCase()) ||
                    task.description
                        .toLowerCase()
                        .includes(search.toLowerCase())
                ) {
                    return true;
                }
            });
        }
        return tasks;
    }
}
