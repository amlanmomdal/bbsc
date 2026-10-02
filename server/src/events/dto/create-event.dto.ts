export class CreateEventDto {
  title?: string;
  eventName?: string;
  shortTitle?: string;
  fullDate?: string;
  date?: string;
  month?: string;
  day?: string;
  status?: string;
  category?: string;
  location?: string;
  time?: string;
  description?: string;
  image?: string;
  images?: string[] | string;
}
