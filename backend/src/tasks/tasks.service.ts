import {Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "src/entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    async create(title: string, description: string, user_id: string) {
        const task = this.taskRepository.create({
            title,
            description,
            status: "pendente",
            user: { id: user_id }
        });
        return await this.taskRepository.save(task);
    }

    async findAll(userId: string) {
        return await this.taskRepository.find({
            where: { user: { id: userId } }
        });
    }

    async findOne(id: string) {
        return await this.taskRepository.findOne({ where: { id } });
    }

    async update(id: string, task: TaskEntity) {
        return await this.taskRepository.update(id, task);
    }

    async remove(id: string) {
        return await this.taskRepository.delete(id);
    }
}
