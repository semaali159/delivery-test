// import { Schema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CaptainDocument = Captain & Document
@Schema({ timestamps: true })
export class Captain {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  vehicleType: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ enum: ['online', 'offline'], default: 'offline' })
  availability: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  })
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
}

export const CaptainSchema = SchemaFactory.createForClass(Captain);