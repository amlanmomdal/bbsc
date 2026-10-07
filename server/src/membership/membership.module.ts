import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { Membership, MembershipSchema } from '../schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Membership.name, schema: MembershipSchema }]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
