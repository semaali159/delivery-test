import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop()
  customerName: string;

  @Prop()
  customerPhone: string;

  @Prop()
  region: string;

  @Prop()
  fullAddress: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
    },
  })
  location: {
    lat: number;
    lng: number;
  };

  @Prop({
    enum: ['created', 'assigned', 'picked_up', 'delivered', 'cancelled'],
    default: 'created',
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Captain' })
  captainId?: string;

  @Prop()
  externalReference?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ captainId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, region: 1 });
OrderSchema.index({ orderNumber: 'text', customerName: 'text', customerPhone: 'text' });