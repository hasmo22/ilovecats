import { Test, TestingModule } from '@nestjs/testing';
import { PricesService } from './prices.service';
import { Cat } from 'src/users/entities/cat.entity';

describe('PricesService', () => {
  let service: PricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricesService],
    }).compile();

    service = module.get<PricesService>(PricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should calculate the correct price for multiple cats with active subscriptions', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Milo', subscriptionActive: true, breed: 'Persian', pouchSize: 'B' },
        { name: 'Bella', subscriptionActive: true, breed: 'Maine Coon', pouchSize: 'C' },
      ];

      const result = service.calculatePrice(cats);

      // Expected total: A (55.5) + B (59.5) + C (62.75) = 177.75
      expect(result).toBe(177.75);
    });

    it('should ignore cats without active subscriptions', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Milo', subscriptionActive: false, breed: 'Persian', pouchSize: 'B' },
        { name: 'Bella', subscriptionActive: true, breed: 'Maine Coon', pouchSize: 'C' },
      ];

      const result = service.calculatePrice(cats);

      // Expected total: A (55.5) + C (62.75) = 118.25
      expect(result).toBe(118.25);
    });

    it('should return 0 if no cats have active subscriptions', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: false, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Milo', subscriptionActive: false, breed: 'Persian', pouchSize: 'B' },
      ];

      const result = service.calculatePrice(cats);

      expect(result).toBe(0);
    });

    it('should return 0 if the pouch size is not found', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'Z' }, // Invalid pouch size
      ];

      const result = service.calculatePrice(cats);

      expect(result).toBe(0);
    });

    it('should handle an empty list of cats', () => {
      const cats: Cat[] = [];

      const result = service.calculatePrice(cats);

      expect(result).toBe(0);
    });
  });

  describe('eligibleForFreeGift', () => {
    it('should return true if the total price exceeds 120', () => {
      const totalPrice = 150;
      const result = service.eligibleForFreeGift(totalPrice);

      expect(result).toBe(true);
    });

    it('should return false if the total price is exactly 120', () => {
      const totalPrice = 120;
      const result = service.eligibleForFreeGift(totalPrice);

      expect(result).toBe(false);
    });

    it('should return false if the total price is below 120', () => {
      const totalPrice = 100;
      const result = service.eligibleForFreeGift(totalPrice);

      expect(result).toBe(false);
    });
  });
});
