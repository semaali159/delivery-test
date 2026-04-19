import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersService } from './Order.service';
import { CaptainService } from '../Captain/Captain.service';
import { AssignCaptainDto } from './dtos/Order-Assigne.dto'

@Injectable()
export class AssignmentService {
  constructor(
    private ordersService: OrdersService,
    private captainsService: CaptainService,
  ) {}

  async assign(orderId: string, dto: AssignCaptainDto) {
    const order = await this.ordersService.findOne(orderId);
    const captain = await this.captainsService.validateCanBeAssigned(dto.captainId);

    if (order.captainId) {
      throw new BadRequestException('Order is already assigned to another captain');
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      throw new BadRequestException('Cannot assign a delivered or cancelled order');
    }

    return await this.ordersService.update(orderId,{
        captainId: dto.captainId,
        status: 'assigned'
    } as any)
}

  async unassign(orderId: string) {
    const order = await this.ordersService.findOne(orderId);

    if (!order.captainId) {
      throw new BadRequestException('Order is not assigned');
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      throw new BadRequestException('Cannot unassign a delivered or cancelled order');
    }

    return await this.ordersService.update(orderId, {
      captainId: null, 
      status: 'created',
    } as any);
  }
}