import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 'Kali Puja' })
  category: string; // Tag / Category (Kali Puja, Saraswati Puja, Events, Competitions, Social Work)

  @Prop()
  shortDescription: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  date: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
