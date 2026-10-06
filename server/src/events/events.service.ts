import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  private async unlinkImageFile(imagePath?: string) {
    if (!imagePath || typeof imagePath !== 'string') return;

    let relativePath = imagePath;
    if (imagePath.includes('/uploads/')) {
      relativePath = imagePath.substring(imagePath.indexOf('/uploads/'));
    }

    if (relativePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', '..', relativePath);
      try {
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`🗑️ Successfully unlinked event image from disk: ${fullPath}`);
        }
      } catch (e: any) {
        console.warn(`Failed to unlink event image file (${fullPath}):`, e?.message || e);
      }
    }
  }

  private parseDateFields(dto: CreateEventDto) {
    const rawDate = dto.fullDate || dto.date || '';
    let month = dto.month || 'NOV';
    let day = dto.day || '12';

    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        month = MONTH_NAMES[d.getMonth()];
        day = String(d.getDate()).padStart(2, '0');
      }
    }

    return {
      title: dto.title || dto.eventName || 'BBSC Festival Event',
      shortTitle: dto.shortTitle || dto.title || dto.eventName || 'Festival',
      fullDate: rawDate,
      month,
      day,
      status: dto.status || 'upcoming',
      category: dto.category || 'Festivals',
      location: dto.location || 'Burul, South 24 Parganas',
      time: dto.time || '10:00 AM IST',
      description: dto.description || '',
      image: dto.image || '/images/kali_puja.jpg',
      images: Array.isArray(dto.images) ? dto.images : (dto.images ? [dto.images] : [])
    };
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event/Festival with ID "${id}" not found.`);
    }
    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    const parsed = this.parseDateFields(dto);
    const created = new this.eventModel(parsed);
    return created.save();
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.eventModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Event/Festival with ID "${id}" not found.`);
    }

    if (dto.image && existing.image && dto.image !== existing.image) {
      await this.unlinkImageFile(existing.image);
    }

    const title = dto.title || dto.eventName || existing.title;
    const shortTitle = dto.shortTitle || dto.shortTitle || existing.shortTitle;
    const fullDate = dto.fullDate || dto.date || existing.fullDate;
    const description = dto.description !== undefined ? dto.description : existing.description;
    const location = dto.location || existing.location;
    const time = dto.time || existing.time;
    const category = dto.category || existing.category;
    const status = dto.status || existing.status;
    const image = dto.image || existing.image;
    
    let images = existing.images || [];
    if (dto.images) {
      images = Array.isArray(dto.images) ? dto.images : [dto.images];
    }

    let month = existing.month;
    let day = existing.day;
    if (fullDate) {
      const d = new Date(fullDate);
      if (!isNaN(d.getTime())) {
        month = MONTH_NAMES[d.getMonth()];
        day = String(d.getDate()).padStart(2, '0');
      }
    }

    const updatedData = {
      title,
      shortTitle,
      fullDate,
      month,
      day,
      status,
      category,
      location,
      time,
      description,
      image,
      images
    };

    const updated = await this.eventModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
    return updated!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event/Festival with ID "${id}" not found.`);
    }

    await this.unlinkImageFile(event.image);
    if (Array.isArray(event.images)) {
      for (const imgPath of event.images) {
        await this.unlinkImageFile(imgPath);
      }
    }

    await this.eventModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Event/Festival and associated image files deleted successfully.' };
  }
}
