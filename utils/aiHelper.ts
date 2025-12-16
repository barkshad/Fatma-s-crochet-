// AI Functionality disabled
export interface AIProductData {
  name: string;
  category: 'Bags' | 'Sweaters' | 'Baby' | 'Accessories' | 'Home';
  price: number;
  description: string;
  materials: string;
  care: string;
}

export const generateProductDetailsFromImage = async (file: File): Promise<AIProductData | null> => {
  console.warn("AI functionality has been disabled.");
  return null;
};