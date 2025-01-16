import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesService } from './deliveries.service';
import { PricesService } from '../prices/prices.service';
import { Cat } from 'src/users/entities/cat.entity';
import { NextDeliveryDto } from './dto/next-delivery.dto';

describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let pricesService: PricesService;

  beforeEach(async () => {
    const mockPricesService = {
      calculatePrice: jest.fn(),
      eligibleForFreeGift: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        { provide: PricesService, useValue: mockPricesService },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    pricesService = module.get<PricesService>(PricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeliveryDetails', () => {
    it('should return delivery details for valid cats', () => {
      const cats: Cat[] = [
        { name: 'Luna', subscriptionActive: true, breed: 'Siamese', pouchSize: 'A' },
        { name: 'Milo', subscriptionActive: true, breed: 'Persian', pouchSize: 'B' },
      ];

      jest.spyOn(pricesService, 'calculatePrice').mockReturnValue(120);
      jest.spyOn(pricesService, 'eligibleForFreeGift').mockReturnValue(true);

      const result: NextDeliveryDto = service.getDeliveryDetails(cats);

      expect(pricesService.calculatePrice).toHaveBeenCalledWith(cats);
      expect(pricesService.eligibleForFreeGift).toHaveBeenCalledWith(120);
      expect(result).toEqual({
        inDays: 'two',
        totalPrice: 120,
        freeGift: true,
      });
    });

    it('should return delivery details with no free gift when total price is below the threshold', () => {
      const cats: Cat[] = [
        { name: 'Bella', subscriptionActive: true, breed: 'Maine Coon', pouchSize: 'C' },
      ];

      jest.spyOn(pricesService, 'calculatePrice').mockReturnValue(50);
      jest.spyOn(pricesService, 'eligibleForFreeGift').mockReturnValue(false);

      const result: NextDeliveryDto = service.getDeliveryDetails(cats);

      expect(pricesService.calculatePrice).toHaveBeenCalledWith(cats);
      expect(pricesService.eligibleForFreeGift).toHaveBeenCalledWith(50);
      expect(result).toEqual({
        inDays: 'two',
        totalPrice: 50,
        freeGift: false,
      });
    });

    it('should return delivery details with no cats provided', () => {
      const cats: Cat[] = [];

      jest.spyOn(pricesService, 'calculatePrice').mockReturnValue(0);
      jest.spyOn(pricesService, 'eligibleForFreeGift').mockReturnValue(false);

      const result: NextDeliveryDto = service.getDeliveryDetails(cats);

      expect(pricesService.calculatePrice).toHaveBeenCalledWith(cats);
      expect(pricesService.eligibleForFreeGift).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        inDays: 'two',
        totalPrice: 0,
        freeGift: false,
      });
    });
  });
});
