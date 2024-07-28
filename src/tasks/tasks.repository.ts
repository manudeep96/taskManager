// import { EntityRepository, Repository } from "typeorm";
// import { Task } from "./task.entity";

// @EntityRepository(Task)
// export class TasksRepository extends Repository<Task> {

// }

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksRepository {
    constructor(
        @Inject('TASK_REPOSITORY')
        private tasksRepository: Repository<Task>,
    ) {}

    async findAll(): Promise<Task[]> {
        return this.tasksRepository.find();
    }
}
