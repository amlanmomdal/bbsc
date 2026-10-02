import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../schemas/event.schema';
import { Winner, WinnerSchema } from '../schemas/winner.schema';
import { Gallery, GallerySchema } from '../schemas/gallery.schema';
import { Committee, CommitteeSchema } from '../schemas/committee.schema';
import { Competition, CompetitionSchema } from '../schemas/competition.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Winner.name, schema: WinnerSchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: Committee.name, schema: CommitteeSchema },
      { name: Competition.name, schema: CompetitionSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
