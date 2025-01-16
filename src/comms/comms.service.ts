import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UUID } from 'crypto';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { Cat } from 'src/users/entities/cat.entity';

@Injectable()
export class CommsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly deliveriesService: DeliveriesService,
  ) {}

  getWelcomeMessage(userId: UUID): String {
    const user: User | undefined = this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    const formattedCatNames = this.formatCatNames(user.cats);

    return `Welcome to KatKin, ${fullName}! We're super excited for ${formattedCatNames} to join the KatKin club and start loving fresh!`;
  }

  getNextDeliveryDetails(userId: UUID): {
    title: string;
    message: string;
    totalPrice: number;
    freeGift: boolean;
  } {
    const user: User | undefined = this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedCatNames = this.formatCatNames(user.cats ?? [], true);
    const deliveryDetails = this.deliveriesService.getDeliveryDetails(user.cats ?? []);

    return {
      title: `Your next delivery for ${formattedCatNames}`,
      message: `Hey ${user.firstName}! In ${deliveryDetails.inDays} days' time, we'll be charging you for your next order for ${formattedCatNames}'s fresh food.`,
      totalPrice: deliveryDetails.totalPrice,
      freeGift: deliveryDetails.freeGift,
    };
  }

  // Utility function
  formatCatNames(cats: Cat[], subscribedOnly = false): string {
    const filteredCats = subscribedOnly
      ? cats.filter(cat => cat.subscriptionActive)
      : cats;
  
    const catNames = filteredCats.map(cat => cat.name);
  
    const formattedCatNames =
      catNames.length > 1
        ? `${catNames.slice(0, -1).join(', ')} and ${catNames[catNames.length - 1]}`
        : catNames[0] || '';
  
    return formattedCatNames;
  }
}
