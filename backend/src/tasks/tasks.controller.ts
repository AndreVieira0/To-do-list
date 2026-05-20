import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Req } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskEntity } from "src/entities/task.entity";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    async create(
        @Req() req: any,
        @Body('title') title: string,
        @Body('description') description: string,
    ) {
        const userId = req.user.id;
        return await this.tasksService.create(title, description, userId);
    }
    
    //buscar todas as tarefas do usuário logado
    @Get()
    async findAll(@Req() req: any) {
        const userId = req.user.id;
        return await this.tasksService.findAll(userId);
    }

    //buscar uma tarefa por id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.tasksService.findOne(id);
    }

    //atualizar uma tarefa por id
    @Put(':id')
    async update(@Param('id') id: string, @Body() task: TaskEntity) {
        return await this.tasksService.update(id, task);
    }
    //deletar uma tarefa por id
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.tasksService.remove(id);
    }
}
