import { CreateGalleryDto } from './create-gallery.dto';

export class UpdateGalleryDto {
  title?: string;
  category?: string;
  tag?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  date?: string;
}
