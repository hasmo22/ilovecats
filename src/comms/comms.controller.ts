import { Controller, Get, Param, Res, HttpStatus, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CommsService } from './comms.service';
import { Response } from 'express';
import { UUID } from 'crypto';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('welcome-fresh/:userId')
  welcome(@Param('userId', ParseUUIDPipe) userId: UUID, @Res() res: Response) {
    try {
      const message = this.commsService.getWelcomeMessage(userId);
      return res.json({ message });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }

  @Get('your-next-delivery/:userId')
  nextDelivery(@Param('userId', ParseUUIDPipe) userId: UUID, @Res() res: Response) {
    try {
      const deliveryDetails = this.commsService.getNextDeliveryDetails(userId);
      return res.json(deliveryDetails);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
}
