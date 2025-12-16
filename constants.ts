import { Product, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Rose Cardigan',
    category: 'Sweaters',
    price: 85,
    image: 'https://picsum.photos/id/1025/600/800',
    description: 'A chunky, hand-knit cardigan featuring soft rose patterns and wooden buttons. Perfect for chilly evenings.',
    materials: '60% Wool, 40% Acrylic blend for softness and durability.',
    care: 'Hand wash cold, lay flat to dry.',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Sage Green Market Bag',
    category: 'Bags',
    price: 35,
    image: 'https://picsum.photos/id/225/600/800',
    description: 'Eco-friendly and stylish. This sturdy market bag expands to fit all your groceries or beach essentials.',
    materials: '100% Cotton yarn.',
    care: 'Machine wash gentle, hang dry.',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Sleepy Bear Baby Blanket',
    category: 'Baby',
    price: 60,
    image: 'https://picsum.photos/id/514/600/800',
    description: 'Incredibly soft heirloom blanket in pastel tones. Hypoallergenic and gentle on baby skin.',
    materials: '100% Bamboo-Cotton blend.',
    care: 'Machine wash cold on delicate cycle.',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Autumn Spice Scarf',
    category: 'Accessories',
    price: 45,
    image: 'https://picsum.photos/id/338/600/800',
    description: 'Long, textured scarf in warm burnt orange and cinnamon tones. Wrap yourself in cozy comfort.',
    materials: 'Merino Wool.',
    care: 'Hand wash only.',
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Boho Fringe Crossbody',
    category: 'Bags',
    price: 55,
    image: 'https://picsum.photos/id/364/600/800',
    description: 'A festival-ready bag with playful fringe details and a secure button closure.',
    materials: 'Recycled cotton cord.',
    care: 'Spot clean only.',
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Cozy Cable Knit Beanie',
    category: 'Accessories',
    price: 30,
    image: 'https://picsum.photos/id/824/600/800',
    description: 'Classic cable knit design with a fluffy faux-fur pompom. Available in cream, grey, and navy.',
    materials: 'Soft acrylic wool.',
    care: 'Hand wash, avoid wetting the pompom.',
    isFeatured: false,
  },
  {
    id: '7',
    name: 'Custom Amigurumi Bunny',
    category: 'Baby',
    price: 40,
    image: 'https://picsum.photos/id/961/600/800',
    description: 'Adorable crochet stuffed bunny. Customizable bow tie color. Safety eyes used.',
    materials: 'Cotton yarn, polyester filling.',
    care: 'Spot clean or gentle hand wash.',
    isFeatured: true,
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    text: "I bought the baby blanket for my niece, and it is the softest thing ever! You can really feel the love in every stitch.",
    location: "Nairobi"
  },
  {
    id: 2,
    name: "Jessica K.",
    text: "Fatma's cardigans are my winter staple. They fit perfectly and the quality is far better than anything from a big store.",
    location: "Mombasa"
  },
  {
    id: 3,
    name: "Amani J.",
    text: "Ordered a custom bag for my wedding favors. Fatma was so patient with my requests. Highly recommended!",
    location: "Kisumu"
  }
];

export const WHATSAPP_NUMBER = "254759094016";