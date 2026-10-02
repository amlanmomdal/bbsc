import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthOtpDocument = AuthOtp & Document;

@Schema({ timestamps: true })
export class AuthOtp {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const AuthOtpSchema = SchemaFactory.createForClass(AuthOtp);
