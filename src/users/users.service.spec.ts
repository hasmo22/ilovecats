import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './entities/user.entity';
import { UUID } from 'crypto';

jest.mock('fs');

describe('UsersService', () => {
  let service: UsersService;
  const mockFilePath = path.join(__dirname, '../../data.json');
  const mockUsers: User[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cats: [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
      ],
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      cats: [
        { name: 'Bella', subscriptionActive: false, breed: 'Maine Coon', pouchSize: 'B' },
      ],
    },
  ];

  beforeEach(async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers));

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should load user data from the file', () => {
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
      expect(service['users']).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user if the ID matches', () => {
      const id: UUID = '123e4567-e89b-12d3-a456-426614174000';
      const user = service.findOne(id);

      expect(user).toEqual(mockUsers[0]);
    });

    it('should return undefined if the ID does not match any user', () => {
      // Generate a valid UUID pattern for the test
      const id: UUID = '00000000-0000-0000-0000-000000000000';
      const user = service.findOne(id);

      expect(user).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should throw an error if the file cannot be read', () => {
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => new UsersService()).toThrow('File not found');
    });

    it('should throw an error if the file contains invalid JSON', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid-json');

      expect(() => new UsersService()).toThrow(SyntaxError);
    });
  });
});
