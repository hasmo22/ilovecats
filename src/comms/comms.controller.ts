import { Controller, Get, Param, Res, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { CommsService } from './comms.service';
import { Response } from 'express';
import { UUID } from 'crypto';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('welcome-fresh/:userId')
  async welcome(@Param('userId', ParseUUIDPipe) userId: UUID, @Res() res: Response) {
    try {
      const message = await this.commsService.getWelcomeMessage(userId);
      return res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }

  @Get('your-next-delivery/:userId')
  async nextDelivery(@Param('userId', ParseUUIDPipe) userId: UUID, @Res() res: Response) {
    try {
      const deliveryDetails = await this.commsService.getNextDeliveryDetails(userId);
      return res.status(HttpStatus.OK).json(deliveryDetails);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unknown error occurred' });
    }
  }
}
