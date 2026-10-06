import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string; // Event Name / Title

  @Prop()
  shortTitle: string; // Short Title

  @Prop()
  fullDate: string; // Date Field e.g. "2026-11-12"

  @Prop()
  month: string;

  @Prop()
  day: string;

  @Prop({ default: 'upcoming' })
  status: string; // 'upcoming' | 'past'

  @Prop({ default: 'Festivals' })
  category: string;

  @Prop()
  location: string;

  @Prop()
  time: string;

  @Prop()
  description: string;

  @Prop()
  image: string; // Primary Banner / Cover Image URL or Path

  @Prop({ type: [String], default: [] })
  images: string[]; // Additional Event Gallery Images
}

export const EventSchema = SchemaFactory.createForClass(Event);
