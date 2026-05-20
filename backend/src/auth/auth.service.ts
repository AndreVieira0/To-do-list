import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/entities/user.entity";
import { UnauthorizedException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
//definindo a classe auth service
export class AuthService { 
    constructor(
        private usersService : UsersService,
        private readonly jwtService: JwtService
    ){}
    
    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new BadRequestException('Email não cadastrado');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new BadRequestException('Senha incorreta')
        }
        return this.generateToken(user);
    }
    async register(
        name: string,
        email:string,
        password:string
    ){
        // 1. verificar se o usuário existe
        const usuarios = await this.usersService.findAll();
        const emailExists = usuarios.find(user => user.email === email);

        if(emailExists){
            throw new BadRequestException('Email ja cadastrado');
        }

        // 2. Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Criar o usuário
        return await this.usersService.create({
            name: name,
            email: email,
            password: passwordHash,
        });
    }
    
        //gerar o token JWT
    private generateToken(user: UserEntity){
            return this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        }
    }
