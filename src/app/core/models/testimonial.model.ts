// src/app/core/models/testimonial.model.ts
export interface Testimonial {
    id?: string;
    name: string;
    rating: number;
    comment: string;
    date: Date;
    avatar?: string;
    location?: string;
    roomType?: string;
  }