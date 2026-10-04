import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Gallery, GallerySchema } from '../schemas/gallery.schema';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
