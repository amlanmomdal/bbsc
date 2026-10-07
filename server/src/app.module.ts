import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { EventsModule } from './events/events.module';
import { GalleryModule } from './gallery/gallery.module';
import { CommitteeModule } from './committee/committee.module';
import { MembershipModule } from './membership/membership.module';
import { DocsModule } from './docs/docs.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://bbsc_admin:66jsAHzD9SR9lTic@cluster0.dnei5li.mongodb.net/bbsc?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      dbName: 'bbsc',
    }),
    DatabaseModule,
    CloudinaryModule,
    AuthModule,
    CompetitionsModule,
    EventsModule,
    GalleryModule,
    CommitteeModule,
    MembershipModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
