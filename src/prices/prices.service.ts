import { Injectable } from '@nestjs/common';
import { Cat } from 'src/users/entities/cat.entity';

@Injectable()
export class PricesService {
  private pouchSizePricing: Record<string, number> = {
    A: 55.5,
    B: 59.5,
    C: 62.75,
    D: 66.0,
    E: 69.0,
    F: 71.25,
  };

  calculatePrice(cats: Cat[]): number {
    return cats.reduce((total, cat) => {
      if (cat.subscriptionActive) {
        const price = this.pouchSizePricing[cat.pouchSize] || 0;
        return total + price;
      }
      return total;
    }, 0);
  }

  eligibleForFreeGift(totalPrice: number) {
    return (totalPrice > 120 ? true : false);
  }
}
