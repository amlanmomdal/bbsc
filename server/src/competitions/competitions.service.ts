import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Competition, CompetitionDocument } from '../schemas/competition.schema';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectModel(Competition.name) private competitionModel: Model<CompetitionDocument>,
  ) {}

  private async unlinkIconFile(iconPath?: string) {
    if (!iconPath || typeof iconPath !== 'string') return;

    let relativePath = iconPath;
    if (iconPath.includes('/uploads/')) {
      relativePath = iconPath.substring(iconPath.indexOf('/uploads/'));
    }

    if (relativePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', '..', relativePath);
      try {
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`🗑️ Successfully unlinked icon image from disk: ${fullPath}`);
        }
      } catch (e: any) {
        console.warn(`Failed to unlink icon file (${fullPath}):`, e?.message || e);
      }
    }
  }

  async findAll(): Promise<Competition[]> {
    return this.competitionModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Competition> {
    const competition = await this.competitionModel.findById(id).exec();
    if (!competition) {
      throw new NotFoundException(`Cultural Competition with ID "${id}" not found.`);
    }
    return competition;
  }

  async create(dto: CreateCompetitionDto): Promise<Competition> {
    const created = new this.competitionModel(dto);
    return created.save();
  }

  async update(id: string, dto: CreateCompetitionDto): Promise<Competition> {
    const existing = await this.competitionModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Cultural Competition with ID "${id}" not found.`);
    }

    if (dto.icon && existing.icon && dto.icon !== existing.icon) {
      await this.unlinkIconFile(existing.icon);
    }

    const updated = await this.competitionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    return updated!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const competition = await this.competitionModel.findById(id).exec();
    if (!competition) {
      throw new NotFoundException(`Cultural Competition with ID "${id}" not found.`);
    }

    await this.unlinkIconFile(competition.icon);
    await this.competitionModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Cultural Competition and associated icon image file deleted successfully.' };
  }
}
