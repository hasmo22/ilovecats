import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [PricesModule],
  providers: [DeliveriesService],
  exports: [DeliveriesService]
})
export class DeliveriesModule {}
