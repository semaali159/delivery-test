import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../Order/Order.schema';
import { OrderVolumeDropQueryDto } from './dtos/Order-volume-drop-query.dto';
@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getCaptainOrderVolumeDrop(query: OrderVolumeDropQueryDto) {
  const {
    previousFrom,
    previousTo,
    currentFrom,
    currentTo,
    minPreviousOrders = 5,
    minDropPercentage = 30,
    page = 1,
    limit = 20,
    sortBy = 'dropPercentage',
    sortOrder = 'desc',
  } = query;

  const previousStart = new Date(previousFrom);
  const previousEnd = new Date(previousTo);
  const currentStart = new Date(currentFrom);
  const currentEnd = new Date(currentTo);

  const pipeline = [
    {
      $match: {
        captainId: { $ne: null },
        status: { $in: ['assigned', 'picked_up', 'delivered'] },
      },
    },
    {
      $group: {
        _id: '$captainId',
        previousOrders: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ['$createdAt', previousStart] }, { $lte: ['$createdAt', previousEnd] }] },
              1,
              0,
            ],
          },
        },
        currentOrders: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ['$createdAt', currentStart] }, { $lte: ['$createdAt', currentEnd] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $addFields: {
        dropCount: { $subtract: ['$previousOrders', '$currentOrders'] },
        dropPercentage: {
          $multiply: [
            {
              $cond: {
                if: { $eq: ['$previousOrders', 0] },
                then: 0,
                else: { $divide: [{ $subtract: ['$previousOrders', '$currentOrders'] }, '$previousOrders'] },
              },
            },
            100,
          ],
        },
      },
    },
    {
      $match: {
        previousOrders: { $gte: minPreviousOrders },
        dropPercentage: { $gte: minDropPercentage },
      },
    },
    {
      $lookup: {
        from: 'captains',
        localField: '_id',
        foreignField: '_id',
        as: 'captain',
      },
    },
    { $unwind: '$captain' },
    {
      $project: {
        captainId: '$_id',
        captainName: '$captain.name',
        previousOrders: 1,
        currentOrders: 1,
        dropCount: 1,
        dropPercentage: { $round: ['$dropPercentage', 2] },
      },
    },
    { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const results = await this.orderModel.aggregate(pipeline);

  
  const totalPipeline = [...pipeline.slice(0, -2)]; 
  const totalResult = await this.orderModel.aggregate([
    ...totalPipeline,
    { $count: 'total' },
  ]);

  const total = totalResult[0]?.total || 0;

  return {
    data: results,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}}