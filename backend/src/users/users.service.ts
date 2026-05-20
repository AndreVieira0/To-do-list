import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  // Criar um novo usuário
  async create(dadosDoUsuario: Partial<UserEntity>) {
    const NewUser = this.userRepository.create(dadosDoUsuario);
    return await this.userRepository.save(NewUser);
  }
  // Buscar todos os usuários
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  // Buscar um usuário por ID
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Buscar um usuário pelo e-mail
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // atualizar um usuário
  async update(id: string, dadosAtualizados: Partial<UserEntity>) {
    const user = await this.findOne(id);
    this.userRepository.merge(user, dadosAtualizados);
    return await this.userRepository.save(user);
  }

  // Deletar um usuário
  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
