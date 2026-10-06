import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from '../schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
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
          console.log(`🗑️ Successfully unlinked gallery photo from disk: ${fullPath}`);
        }
      } catch (e: any) {
        console.warn(`Failed to unlink gallery photo file (${fullPath}):`, e?.message || e);
      }
    }
  }

  async findAll(category?: string): Promise<Gallery[]> {
    const filter: any = {};
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }
    return this.galleryModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Gallery> {
    const item = await this.galleryModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Gallery item with ID "${id}" not found.`);
    }
    return item;
  }

  async create(dto: CreateGalleryDto): Promise<Gallery> {
    const categoryTag = dto.category || dto.tag || 'Kali Puja';
    const shortDesc = dto.shortDescription || dto.description || '';
    const dateStr = dto.date || new Date().toISOString().split('T')[0];

    const created = new this.galleryModel({
      title: dto.title || 'BBSC Event Photo',
      category: categoryTag,
      shortDescription: shortDesc,
      image: dto.image || '/images/kali_puja.jpg',
      date: dateStr,
    });
    return created.save();
  }

  async update(id: string, dto: UpdateGalleryDto): Promise<Gallery> {
    const existing = await this.galleryModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Gallery item with ID "${id}" not found.`);
    }

    if (dto.image && existing.image && dto.image !== existing.image) {
      await this.unlinkImageFile(existing.image);
    }

    const categoryTag = dto.category || dto.tag || existing.category;
    const shortDesc = dto.shortDescription !== undefined ? dto.shortDescription : (dto.description !== undefined ? dto.description : existing.shortDescription);

    const updatedData = {
      title: dto.title || existing.title,
      category: categoryTag,
      shortDescription: shortDesc,
      image: dto.image || existing.image,
      date: dto.date || existing.date,
    };

    const updated = await this.galleryModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
    return updated!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const item = await this.galleryModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Gallery item with ID "${id}" not found.`);
    }

    await this.unlinkImageFile(item.image);
    await this.galleryModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Gallery item and associated image file deleted successfully.' };
  }
}
