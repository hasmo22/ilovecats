import { Test, TestingModule } from '@nestjs/testing';
import { CommsService } from './comms.service';
import { UsersService } from '../users/users.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Cat } from '../users/entities/cat.entity';
import { NextDeliveryDto } from '../deliveries/dto/next-delivery.dto';

describe('CommsService', () => {
  let service: CommsService;
  let usersService: UsersService;
  let deliveriesService: DeliveriesService;

  beforeEach(async () => {
    const mockUsersService = {
      findOne: jest.fn(),
    };
    const mockDeliveriesService = {
      getDeliveryDetails: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommsService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: DeliveriesService, useValue: mockDeliveriesService },
      ],
    }).compile();

    service = module.get<CommsService>(CommsService);
    usersService = module.get<UsersService>(UsersService);
    deliveriesService = module.get<DeliveriesService>(DeliveriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWelcomeMessage', () => {
    it('should return a welcome message for a valid user', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cats: [
          { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        ],
      };

      jest.spyOn(usersService, 'findOne').mockReturnValue(user);

      const result = service.getWelcomeMessage(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toBe(
        "Welcome to KatKin, John Doe! We're super excited for Luna to join the KatKin club and start loving fresh!"
      );
    });

    it('should throw a NotFoundException if the user is not found', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(usersService, 'findOne').mockReturnValue(undefined);

      expect(() => service.getWelcomeMessage(userId)).toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('getNextDeliveryDetails', () => {
    it('should return next delivery details as NextDeliveryDto for a valid user', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cats: [
          { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        ],
      };

      const deliveryDetails: NextDeliveryDto = {
        inDays: '3',
        totalPrice: 59.99,
        freeGift: true,
      };

      jest.spyOn(usersService, 'findOne').mockReturnValue(user);
      jest.spyOn(deliveriesService, 'getDeliveryDetails').mockReturnValue(deliveryDetails);

      const result = service.getNextDeliveryDetails(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(deliveriesService.getDeliveryDetails).toHaveBeenCalledWith(user.cats);
      expect(result).toEqual({
        title: 'Your next delivery for Luna',
        message:
          "Hey John! In 3 days' time, we'll be charging you for your next order for Luna's fresh food.",
        totalPrice: 59.99,
        freeGift: true,
      });
    });

    it('should throw a NotFoundException if the user is not found', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(usersService, 'findOne').mockReturnValue(undefined);

      expect(() => service.getNextDeliveryDetails(userId)).toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('formatCatNames', () => {
    it('should format cat names correctly for multiple cats', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Bella', subscriptionActive: true, breed: 'Maine Coon', pouchSize: 'B' },
        { name: 'Milo', subscriptionActive: true, breed: 'Persian', pouchSize: 'C' },
      ];

      const result = service.formatCatNames(cats);

      expect(result).toBe('Luna, Bella and Milo');
    });

    it('should format cat names correctly for a single cat', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
      ];

      const result = service.formatCatNames(cats);

      expect(result).toBe('Luna');
    });

    it('should return an empty string if no cats are provided', () => {
      const result = service.formatCatNames([]);

      expect(result).toBe('');
    });

    it('should only include subscribed cats when subscribedOnly is true', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Bella', subscriptionActive: false, breed: 'Maine Coon', pouchSize: 'B' },
      ];

      const result = service.formatCatNames(cats, true);

      expect(result).toBe('Luna');
    });
  });
});
