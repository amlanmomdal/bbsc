import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  UseGuards, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(__dirname, '..', '..', 'uploads', 'gallery');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `gallery-image-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|svg|webp)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only image files (JPG, PNG, GIF, SVG, WEBP) are allowed!'), false);
    }
  },
};

@UseGuards(JwtAuthGuard)
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Public()
  @Get()
  async findAll(@Query('category') category?: string, @Query('tag') tag?: string) {
    const filterTag = category || tag;
    const data = await this.galleryService.findAll(filterTag);
    return { success: true, count: data.length, data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.galleryService.findOne(id);
    return { success: true, data };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Please select a gallery image file to upload.');
    }
    const fileUrl = `/uploads/gallery/${file.filename}`;
    return {
      success: true,
      message: 'Gallery image file uploaded successfully.',
      url: fileUrl,
      filename: file.filename,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@Body() dto: CreateGalleryDto, @UploadedFile() file?: any) {
    let imagePath = dto.image;

    if (file) {
      imagePath = `/uploads/gallery/${file.filename}`;
    }

    const data = await this.galleryService.create({
      ...dto,
      image: imagePath || '/images/kali_puja.jpg',
    });
    return { success: true, message: 'Gallery photo added successfully.', data };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(@Param('id') id: string, @Body() dto: UpdateGalleryDto, @UploadedFile() file?: any) {
    let imagePath = dto.image;

    if (file) {
      imagePath = `/uploads/gallery/${file.filename}`;
    }

    const data = await this.galleryService.update(id, {
      ...dto,
      ...(imagePath ? { image: imagePath } : {}),
    });
    return { success: true, message: 'Gallery photo updated successfully.', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
