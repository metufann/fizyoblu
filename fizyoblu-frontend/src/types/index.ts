export interface Service {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  metaDescription?: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  whatsApp: string;
  email: string;
  workingHours: string;
  googleMapsUrl: string;
  embedMapUrl?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface TeamMember {
  id: number;
  fullName: string;
  title: string;
  bio: string;
  imageUrl: string;
  specialities?: string;
  instagram?: string;
  linkedIn?: string;
  order: number;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  author: string;
  readTimeMinutes: number;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
}

export interface MediaItem {
  id: number;
  fileName: string;
  url: string;
  title?: string;
  category?: string;
  contentType?: string;
  fileSizeBytes: number;
  order: number;
  showInGallery: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  interestedService?: string;
  preferredBranch?: string;
  message: string;
  isRead: boolean;
  adminNotes?: string;
  createdAt: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface SiteSettings {
  [key: string]: string;
}
