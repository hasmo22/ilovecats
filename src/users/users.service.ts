import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './entities/user.entity';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly filePath = path.join(__dirname, '../../data.json');
  private users!: User[];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const fileData = fs.readFileSync(this.filePath, 'utf8');
    this.users = JSON.parse(fileData) as User[];
  }

  findOne(id: UUID): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
