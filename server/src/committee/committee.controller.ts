import { 
  Controller, Get, Post, Put, Delete, Body, Param, 
  UseGuards, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(__dirname, '..', '..', 'uploads', 'committee');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `committee-photo-${uniqueSuffix}${ext}`);
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

@ApiTags('Committee Management')
@UseGuards(JwtAuthGuard)
@Controller('committee')
export class CommitteeController {
  constructor(
    private readonly committeeService: CommitteeService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Get all committee members (Public endpoint - No Auth Guard)' })
  @Get()
  async findAll() {
    const data = await this.committeeService.findAll();
    return { success: true, count: data.length, data };
  }

  @Public()
  @ApiOperation({ summary: 'Get single committee member by ID (Public endpoint - No Auth Guard)' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.committeeService.findOne(id);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload committee member photo (Admin protected)' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadPhoto(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Please select a committee member photo file to upload.');
    }
    const fileUrl = await this.cloudinaryService.uploadFile(file, 'committee');
    return {
      success: true,
      message: 'Committee member photo uploaded successfully.',
      url: fileUrl,
      filename: file.filename || file.originalname,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new committee member (Admin protected)' })
  @Post()
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async create(@Body() dto: CreateCommitteeDto, @UploadedFile() file?: any) {
    let photoPath = dto.photo || dto.image;

    if (file) {
      photoPath = await this.cloudinaryService.uploadFile(file, 'committee');
    }

    const data = await this.committeeService.create({
      ...dto,
      photo: photoPath || '',
    });
    return { success: true, message: 'Executive Committee member added successfully.', data };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update committee member by ID (Admin protected)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async update(@Param('id') id: string, @Body() dto: UpdateCommitteeDto, @UploadedFile() file?: any) {
    let photoPath = dto.photo || dto.image;

    if (file) {
      photoPath = await this.cloudinaryService.uploadFile(file, 'committee');
    }

    const data = await this.committeeService.update(id, {
      ...dto,
      ...(photoPath ? { photo: photoPath } : {}),
    });
    return { success: true, message: 'Executive Committee member updated successfully.', data };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete committee member by ID (Admin protected)' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.committeeService.remove(id);
  }
}
