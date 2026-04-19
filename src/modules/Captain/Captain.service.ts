import {BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Captain, CaptainDocument } from "./Captain.schema";
import { Model } from "mongoose";
import { CreateCaptainDto } from "./dtos/Captain-Create.dto";
import { CaptainQueryDto } from "./dtos/CaptainQuery.dto";
import { UpdateCaptainDto } from "./dtos/Captain-update.dto";

@Injectable()
export class CaptainService {
    constructor(
        @InjectModel(Captain.name) private captainModel: Model<CaptainDocument>,
    ){}


    async create(createCaptainDto: CreateCaptainDto):Promise<Captain>{
        const existing = await this.captainModel.findOne({phone: createCaptainDto.phone})
        if(existing){
            throw new BadRequestException('Captain with this phone number already exists')
        }
        
        const captain = new this.captainModel({
            ...createCaptainDto,
            availability:'offline',
            status: createCaptainDto.status || 'active',
        })
        return captain.save()
    }

    async findAll(query: CaptainQueryDto) {
    const { page = 1, limit = 20, search, status, availability, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status) filter.status = status;
    if (availability) filter.availability = availability;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const sortField = sortBy || 'createdAt'; 
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.captainModel.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.captainModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Captain> {
    const captain = await this.captainModel.findById(id).exec();
    if (!captain) throw new NotFoundException('Captain not found');
    return captain;
  }

  async update(id: string, updateCaptainDto: UpdateCaptainDto): Promise<Captain> {
    const captain = await this.findOne(id);
      if (updateCaptainDto.phone) {
      const existing = await this.captainModel.findOne({
        phone: updateCaptainDto.phone,
        _id: { $ne: id },
      });
      if (existing) throw new BadRequestException('Phone already in use');
    }

    const updatedCaptain = await this.captainModel.findByIdAndUpdate(
      id, 
      { $set: updateCaptainDto }, 
      { new: true, runValidators: true } 
    ).exec() as Captain;

    return updatedCaptain;
  }

  async remove(id: string) {
    const captain = await this.findOne(id);
    await this.captainModel.deleteOne({ _id: id });
    return { message: 'Captain deleted successfully' };
  }

async toggleStatus(id: string, newStatus: 'active' | 'inactive'): Promise<Captain> {
    await this.findOne(id);
    
    return await this.captainModel.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    ).exec() as Captain;
  }

  async validateCanBeAssigned(id: string): Promise<Captain> {
    const captain = await this.findOne(id);
    if (captain.status === 'inactive') {
      throw new BadRequestException('Cannot assign inactive captain');
    }
    return captain;
  }
}
