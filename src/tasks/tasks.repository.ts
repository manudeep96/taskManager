// import { EntityRepository, Repository } from "typeorm";
// import { Task } from "./task.entity";

// @EntityRepository(Task)
// export class TasksRepository extends Repository<Task> {

// }

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository {
    constructor(
        @Inject('TASK_REPOSITORY')
        private taskRepository: Repository<Task>,
    ) {}

    async findAll(): Promise<Task[]> {
        return this.taskRepository.find();
    }
}
