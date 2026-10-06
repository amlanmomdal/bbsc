import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(__dirname, '..', '..', 'uploads', 'events');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `event-image-${uniqueSuffix}${ext}`);
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
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Get()
  async findAll() {
    const data = await this.eventsService.findAll();
    return { success: true, count: data.length, data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.eventsService.findOne(id);
    return { success: true, data };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Please select an event image file to upload.');
    }
    const fileUrl = await this.cloudinaryService.uploadFile(file, 'events');
    return {
      success: true,
      message: 'Event image file uploaded successfully.',
      url: fileUrl,
      filename: file.filename || file.originalname,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@Body() dto: CreateEventDto, @UploadedFile() file?: any) {
    let imagePath = dto.image;

    if (file) {
      imagePath = await this.cloudinaryService.uploadFile(file, 'events');
    }

    const data = await this.eventsService.create({
      ...dto,
      image: imagePath || '/images/kali_puja.jpg',
    });
    return { success: true, message: 'Event/Festival created successfully.', data };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @UploadedFile() file?: any) {
    let imagePath = dto.image;

    if (file) {
      imagePath = await this.cloudinaryService.uploadFile(file, 'events');
    }

    const data = await this.eventsService.update(id, {
      ...dto,
      ...(imagePath ? { image: imagePath } : {}),
    });
    return { success: true, message: 'Event/Festival updated successfully.', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
