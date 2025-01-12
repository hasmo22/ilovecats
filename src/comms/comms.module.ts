import { Module } from '@nestjs/common';
import { CommsService } from './comms.service';
import { CommsController } from './comms.controller';
import { UsersModule } from '../users/users.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [UsersModule, DeliveriesModule],
  controllers: [CommsController],
  providers: [CommsService]
})
export class CommsModule {}
