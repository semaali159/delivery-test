import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../../app.module';
import { CaptainDocument, Captain } from '../../modules/Captain/Captain.schema';
import { OrderDocument, Order } from '../../modules/Order/Order.schema';
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const captainModel = app.get<Model<CaptainDocument>>(getModelToken(Captain.name));
  const orderModel = app.get<Model<OrderDocument>>(getModelToken(Order.name));

  await captainModel.deleteMany({});
  await orderModel.deleteMany({});

  const c = await captainModel.create({
    name: 'Seed Captain',
    phone: '+963900000001',
    vehicleType: 'bike',
    status: 'active',
    availability: 'offline',
  });

  await orderModel.create({
    orderNumber: 'ORD-SEED-001',
    customerName: 'Customer',
    customerPhone: '+963900000002',
    region: 'Damascus',
    fullAddress: 'Address',
    location: { lat: 33.5, lng: 36.3 },
    status: 'created',
    captainId: c._id.toString(),
  });

  console.log('Seed done');
  await app.close();
}
run().catch(console.error);