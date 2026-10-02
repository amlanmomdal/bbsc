import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Committee, CommitteeDocument } from '../schemas/committee.schema';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Injectable()
export class CommitteeService {
  constructor(
    @InjectModel(Committee.name) private committeeModel: Model<CommitteeDocument>,
  ) {}

  private async unlinkPhotoFile(photoPath?: string) {
    if (!photoPath || typeof photoPath !== 'string') return;

    let relativePath = photoPath;
    if (photoPath.includes('/uploads/')) {
      relativePath = photoPath.substring(photoPath.indexOf('/uploads/'));
    }

    if (relativePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', '..', relativePath);
      try {
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`🗑️ Successfully unlinked committee member photo from disk: ${fullPath}`);
        }
      } catch (e: any) {
        console.warn(`Failed to unlink committee photo file (${fullPath}):`, e?.message || e);
      }
    }
  }

  async findAll(): Promise<Committee[]> {
    return this.committeeModel.find().sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string): Promise<Committee> {
    const member = await this.committeeModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`Committee member with ID "${id}" not found.`);
    }
    return member;
  }

  async create(dto: CreateCommitteeDto): Promise<Committee> {
    const memberPosition = dto.position || dto.role || 'Executive Member';
    const memberPhoto = dto.photo || dto.image || '';
    const memberContact = dto.contact || dto.phone || '';

    const created = new this.committeeModel({
      name: dto.name || 'Executive Member',
      role: memberPosition,
      photo: memberPhoto,
      contact: memberContact,
    });
    return created.save();
  }

  async update(id: string, dto: UpdateCommitteeDto): Promise<Committee> {
    const existing = await this.committeeModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Committee member with ID "${id}" not found.`);
    }

    const newPhoto = dto.photo || dto.image;
    if (newPhoto && existing.photo && newPhoto !== existing.photo) {
      await this.unlinkPhotoFile(existing.photo);
    }

    const memberPosition = dto.position || dto.role || existing.role;
    const memberContact = dto.contact !== undefined ? dto.contact : (dto.phone !== undefined ? dto.phone : existing.contact);

    const updatedData = {
      name: dto.name || existing.name,
      role: memberPosition,
      photo: newPhoto || existing.photo,
      contact: memberContact,
    };

    const updated = await this.committeeModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
    return updated!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const member = await this.committeeModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`Committee member with ID "${id}" not found.`);
    }

    await this.unlinkPhotoFile(member.photo);
    await this.committeeModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Committee member and associated photo file deleted successfully.' };
  }
}
