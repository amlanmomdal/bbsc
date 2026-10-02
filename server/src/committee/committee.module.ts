import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitteeController } from './committee.controller';
import { CommitteeService } from './committee.service';
import { Committee, CommitteeSchema } from '../schemas/committee.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Committee.name, schema: CommitteeSchema }]),
    AuthModule,
  ],
  controllers: [CommitteeController],
  providers: [CommitteeService],
  exports: [CommitteeService],
})
export class CommitteeModule {}
