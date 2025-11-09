import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  // 注册用户
  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();

    const fountUser = users.find((user) => user.username === registerUserDto.username);
    if (fountUser) {
        throw new BadRequestException('用户名已存在');
    }

    const newUser: User = {
        username: registerUserDto.username,
        password: registerUserDto.password,
    };
    users.push(newUser);
    await this.dbService.write(users);
    return '注册成功';
  }

  // 登录用户
  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();

    const fountUser = users.find((user) => user.username === loginUserDto.username);
    if (!fountUser) {
        throw new BadRequestException('用户名不存在');
    }

    if (fountUser.password !== loginUserDto.password) {
        throw new BadRequestException('密码错误');
    }

    return '登录成功';
  }
}
