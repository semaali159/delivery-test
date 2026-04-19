import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CaptainService } from "../Captain/Captain.service";
import { Order, OrderDocument } from "./Order.schema";
import { Model } from "mongoose";
import { UpdateOrderDto } from "./dtos/Order-Update.dto";
import { OrderQueryDto } from "./dtos/Order-Query.dto";

@Injectable()
export class OrdersService {
    constructor(
         @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
         private captainsService: CaptainService, ){

    }
    async create(createOrderDto: any):Promise<Order>{
        const order = new this.orderModel({
            ...createOrderDto,
            location: { lat: createOrderDto.lat, lng: createOrderDto.lng },
        });
        return order.save();
    }

      async findAllAdvanced(query: OrderQueryDto) {
    const {
      status,
      region,
      captainId,
      fromDate,
      toDate,
      assigned,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};
    const skip = (page - 1) * limit;

    // Filters
    if (status) filter.status = status;
    if (region) filter.region = region;
    if (captainId) filter.captainId = captainId;

    // Assigned / Unassigned
    if (assigned === true) {
      filter.captainId = { $ne: null };
    } else if (assigned === false) {
      filter.captainId = null;
    }

    // Date Range
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Text Search
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('captainId', 'name phone vehicleType status')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),

      this.orderModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        filters: { status, region, assigned, search }, // optional for debugging
      },
    };
  }

  async findOne(id: string): Promise<OrderDocument> {
      const order = await this.orderModel.findById(id).exec();
      if (!order) throw new NotFoundException('Order not found');
      return order;
    }
  
    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
      const order = await this.findOne(id);
  
      if (['delivered', 'cancelled'].includes(order.status)) {
        throw new BadRequestException('Cannot update delivered or cancelled order');
      }
  
      if (updateOrderDto.lat && updateOrderDto.lng) {
        updateOrderDto['location'] = { lat: updateOrderDto.lat, lng: updateOrderDto.lng };
      }
      const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).populate('captainId') as Order;
   
  
      return updatedOrder
    }

    async updateStatus(id: string, status: string, captainId?: string): Promise<Order> {
      return await this.orderModel.findByIdAndUpdate(
        id,
        { $set: { status, captainId } },
        { new: true }
      ).populate('captainId').exec() as Order;
    }

       async remove(id: string) {
    await this.findOne(id);
    await this.orderModel.deleteOne({ _id: id });
    return { message: 'Order deleted successfully' };
  }
}