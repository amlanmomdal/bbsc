import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommitteeDocument = Committee & Document;

@Schema({ timestamps: true })
export class Committee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'Executive Member' })
  role: string; // Position / Role (President, Secretary, Vice President, Treasurer, Executive Member)

  @Prop()
  photo: string; // Photo / Image path (/uploads/committee/xxx.jpg) or URL

  @Prop()
  contact: string;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
