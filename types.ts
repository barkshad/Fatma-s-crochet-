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
  createdAt?: any; // Timestamp from Firestore
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  location: string;
}
