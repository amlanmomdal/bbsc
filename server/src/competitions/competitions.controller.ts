import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(__dirname, '..', '..', 'uploads', 'competitions');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `competition-icon-${uniqueSuffix}${ext}`);
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
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Public()
  @Get()
  async findAll() {
    const data = await this.competitionsService.findAll();
    return { success: true, data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.competitionsService.findOne(id);
    return { success: true, data };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadIcon(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Please select an icon image file to upload.');
    }
    const fileUrl = `/uploads/competitions/${file.filename}`;
    return {
      success: true,
      message: 'Icon image file uploaded successfully.',
      url: fileUrl,
      filename: file.filename,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('icon', multerConfig))
  async create(@Body() dto: CreateCompetitionDto, @UploadedFile() file?: any) {
    let iconPath = dto.icon;

    if (file) {
      iconPath = `/uploads/competitions/${file.filename}`;
    }

    if (!iconPath) {
      throw new BadRequestException('Icon image file or icon value is required.');
    }

    const data = await this.competitionsService.create({
      title: dto.title,
      icon: iconPath,
    });
    return { success: true, message: 'Cultural Competition created successfully.', data };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('icon', multerConfig))
  async update(@Param('id') id: string, @Body() dto: CreateCompetitionDto, @UploadedFile() file?: any) {
    let iconPath = dto.icon;

    if (file) {
      iconPath = `/uploads/competitions/${file.filename}`;
    }

    const data = await this.competitionsService.update(id, {
      title: dto.title,
      ...(iconPath ? { icon: iconPath } : {}),
    });
    return { success: true, message: 'Cultural Competition updated successfully.', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.competitionsService.remove(id);
  }
}
