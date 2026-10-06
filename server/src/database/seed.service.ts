import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Winner, WinnerDocument } from '../schemas/winner.schema';
import { Gallery, GalleryDocument } from '../schemas/gallery.schema';
import { Committee, CommitteeDocument } from '../schemas/committee.schema';
import { Competition, CompetitionDocument } from '../schemas/competition.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Winner.name) private winnerModel: Model<WinnerDocument>,
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
    @InjectModel(Committee.name) private committeeModel: Model<CommitteeDocument>,
    @InjectModel(Competition.name) private competitionModel: Model<CompetitionDocument>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('🌱 Checking MongoDB Atlas [bbsc] database seed status...');
      await this.seedInitialData();
    } catch (err: any) {
      this.logger.warn(`Database seed check: ${err?.message || err}`);
    }
  }

  private async seedInitialData() {
    const eventCount = await this.eventModel.countDocuments();
    if (eventCount === 0) {
      this.logger.log('🌱 Seeding initial BBSC Events into MongoDB Atlas...');
      await this.eventModel.insertMany([
        {
          title: 'Drawing Competition',
          fullDate: '2024-08-15',
          month: 'AUG',
          day: '15',
          status: 'upcoming',
          category: 'Competitions',
          location: 'Club Premises & Auditorium',
          time: '09:00 AM IST',
          description: 'Annual Independence Day Sit-and-Draw contest for children divided into 3 age groups.',
          image: '/images/saraswati_puja.jpg'
        },
        {
          title: 'Dance Competition',
          fullDate: '2024-09-10',
          month: 'SEP',
          day: '10',
          status: 'upcoming',
          category: 'Competitions',
          location: 'BBSC Open Stage',
          time: '05:00 PM IST',
          description: 'Classical, Folk, and Modern Creative Solo & Group dance contest.',
          image: '/images/bbsc_hero_seamless_correct.jpg'
        },
        {
          title: 'Grand Kali Puja',
          fullDate: '2024-11-12',
          month: 'NOV',
          day: '12',
          status: 'upcoming',
          category: 'Festivals',
          location: 'Burul Central Ground',
          time: '07:00 PM IST',
          description: 'The mega annual festival featuring traditional rituals, musical evening, and illumination show.',
          image: '/images/kali_puja.jpg'
        }
      ]);
    }

    const winnerCount = await this.winnerModel.countDocuments();
    if (winnerCount === 0) {
      this.logger.log('🌱 Seeding initial Competition Winners into MongoDB Atlas...');
      await this.winnerModel.insertMany([
        { year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Riya Mondal', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', remarks: 'Classical Solo Performance' },
        { year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category A (Junior)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Aarohi Das', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Landscape Oil Pastel' }
      ]);
    }

  }
}
