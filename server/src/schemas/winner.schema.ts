import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WinnerDocument = Winner & Document;

@Schema({ timestamps: true })
export class Winner {
  @Prop({ required: true })
  year: string;

  @Prop()
  competitionId: number;

  @Prop({ required: true })
  competitionTitle: string;

  @Prop()
  subCategory: string;

  @Prop({ required: true })
  rank: number;

  @Prop()
  rankLabel: string;

  @Prop({ required: true })
  winnerName: string;

  @Prop()
  ageGroup: string;

  @Prop()
  photo: string;

  @Prop()
  remarks: string;
}

export const WinnerSchema = SchemaFactory.createForClass(Winner);
