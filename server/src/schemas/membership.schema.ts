import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  age: number;

  @Prop()
  occupation: string;

  @Prop()
  address: string;

  @Prop({ default: 'General Volunteer' })
  interest: string;

  @Prop({ default: 'pending' })
  status: string; // 'pending' | 'approved' | 'rejected'

  @Prop()
  date: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
