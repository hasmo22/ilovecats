import { Test, TestingModule } from '@nestjs/testing';
import { CommsController } from './comms.controller';
import { CommsService } from './comms.service';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('CommsController', () => {
  let controller: CommsController;
  let commsService: CommsService;

  beforeEach(async () => {
    const mockCommsService = {
      getWelcomeMessage: jest.fn(),
      getNextDeliveryDetails: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommsController],
      providers: [{ provide: CommsService, useValue: mockCommsService }],
    }).compile();

    controller = module.get<CommsController>(CommsController);
    commsService = module.get<CommsService>(CommsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('welcome', () => {
    it('should return a welcome message if the user exists', () => {
      const mockResponse = { json: jest.fn() } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const message = 'Welcome to KatKin!';

      jest.spyOn(commsService, 'getWelcomeMessage').mockReturnValue(message);

      controller.welcome(userId, mockResponse);

      expect(commsService.getWelcomeMessage).toHaveBeenCalledWith(userId);
      expect(mockResponse.json).toHaveBeenCalledWith({ message });
    });

    it('should return 404 if the user does not exist', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(commsService, 'getWelcomeMessage').mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      controller.welcome(userId, mockResponse);

      expect(commsService.getWelcomeMessage).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 for unexpected errors', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(commsService, 'getWelcomeMessage').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      controller.welcome(userId, mockResponse);

      expect(commsService.getWelcomeMessage).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'An unknown error occurred',
      });
    });
  });

  describe('nextDelivery', () => {
    it('should return delivery details if the user exists', () => {
      const mockResponse = { json: jest.fn() } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const deliveryDetails = {
        title: 'Your next delivery for Luna',
        message: 'Hey John! In 3 days...',
        totalPrice: 99.99,
        freeGift: true,
      };

      jest.spyOn(commsService, 'getNextDeliveryDetails').mockReturnValue(deliveryDetails);

      controller.nextDelivery(userId, mockResponse);

      expect(commsService.getNextDeliveryDetails).toHaveBeenCalledWith(userId);
      expect(mockResponse.json).toHaveBeenCalledWith(deliveryDetails);
    });

    it('should return 404 if the user does not exist', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(commsService, 'getNextDeliveryDetails').mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      controller.nextDelivery(userId, mockResponse);

      expect(commsService.getNextDeliveryDetails).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 for unexpected errors', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      jest.spyOn(commsService, 'getNextDeliveryDetails').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      controller.nextDelivery(userId, mockResponse);

      expect(commsService.getNextDeliveryDetails).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'An unknown error occurred',
      });
    });
  });
});
