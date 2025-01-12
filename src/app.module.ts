import { Module } from '@nestjs/common';
import { CommsModule } from './comms/comms.module';
import { UsersModule } from './users/users.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [CommsModule, UsersModule, DeliveriesModule, PricesModule]
})
export class AppModule {}
