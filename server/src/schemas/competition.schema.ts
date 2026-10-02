import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompetitionDocument = Competition & Document;

@Schema({ timestamps: true })
export class Competition {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 'Palette' })
  icon: string;
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);
