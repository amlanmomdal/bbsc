import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from '../schemas/membership.schema';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipStatusDto } from './dto/update-membership-status.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
  ) {}

  async create(dto: CreateMembershipDto): Promise<Membership> {
    if (!dto.fullName || !dto.phone) {
      throw new BadRequestException('Full name and phone number are required.');
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const newApplication = new this.membershipModel({
      fullName: dto.fullName,
      email: dto.email || '',
      phone: dto.phone,
      address: dto.address || 'Burul, South 24 Parganas',
      interest: dto.interest || 'General Volunteer',
      age: dto.age || null,
      occupation: dto.occupation || '',
      status: 'pending',
      date: todayDate,
    });

    return newApplication.save();
  }

  async findAll(status?: string): Promise<Membership[]> {
    const filter = status && status !== 'all' ? { status } : {};
    return this.membershipModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Membership> {
    const item = await this.membershipModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Membership application with ID "${id}" not found.`);
    }
    return item;
  }

  async updateStatus(id: string, dto: UpdateMembershipStatusDto): Promise<Membership> {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(dto.status)) {
      throw new BadRequestException(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const updated = await this.membershipModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Membership application with ID "${id}" not found.`);
    }

    return updated;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const res = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Membership application with ID "${id}" not found.`);
    }
    return { success: true, message: 'Membership application deleted successfully.' };
  }
}
