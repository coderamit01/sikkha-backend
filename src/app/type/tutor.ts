import { Gender } from "../../generated/prisma/enums";

export interface TutorProfile {
  name: string;
  email: string;
  image?: string;
  contactNumber?: string;
  gender: Gender;
  userId: string;
  hourlyRate?: number;
  yearsExperience?: number;
}
export interface TutorUpdateProfile {
  name: string;
  email: string;
  image?: string;
  contactNumber?: string;
  gender: Gender;
  userId: string;
  hourlyRate?: number;
  yearsExperience?: number;

}

export interface TutorFilters {
  category?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  search?: string;
}