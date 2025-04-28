import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    const newUser = {
      id: Date.now().toString(),
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword, // 암호화된 비밀번호 저장
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (user) {
      Object.assign(user, updateUserDto);
    }
    return user;
  }

  remove(id: string) {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) {
      const removed = this.users.splice(index, 1);
      return removed[0];
    }
    return null;
  }

  changePassword(id: string, newPassword: string) {
    const user = this.findOne(id);
    if (user) {
      user.password = newPassword;
      return { message: 'Password changed' };
    }
    return { message: 'User not found' };
  }

  findUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }
  

}
