export class Event {
  id?: string;
  name?: string;
  description?: string;
  lat?: number;
  lng?: number;
  place_name?: string;
  organizator?: string;
  img?: string;
  date_start?: Date;
  date_end?: Date;
  category?: string;
  tickets?: number;
  ticketsLeft?: number;
  published?: boolean;
  createdAt?: Date;
}
