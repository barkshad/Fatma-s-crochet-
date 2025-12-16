export interface Product {
  id: string;
  name: string;
  category: 'Bags' | 'Sweaters' | 'Baby' | 'Accessories' | 'Home';
  price: number;
  image: string;
  description: string;
  materials: string;
  care: string;
  isFeatured?: boolean;
  createdAt?: any;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  location: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundVideo: string;
  heroImage1: string;
  heroImage2: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutImage: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
}