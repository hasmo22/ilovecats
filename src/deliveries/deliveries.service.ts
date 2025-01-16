import { Injectable } from '@nestjs/common';
import { PricesService } from '../prices/prices.service';
import { Cat } from 'src/users/entities/cat.entity';
import { NextDeliveryDto } from './dto/next-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private readonly pricesService: PricesService) {}

  private getNextDelivery(): string {
    return "two";  // hardcoded for this example implementation
  }

  getDeliveryDetails(cats: Cat[]): NextDeliveryDto {
    const inDays = this.getNextDelivery();
    const totalPrice = this.pricesService.calculatePrice(cats);
    const freeGift = this.pricesService.eligibleForFreeGift(totalPrice);

    return {
      inDays,
      totalPrice,
      freeGift,
    };
  }
}
