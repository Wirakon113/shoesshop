import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'MONO RUNNER 01',
    category: 'Running',
    price: 2990,
    description: 'Lightweight running sneakers designed for everyday performance. Engineered with breathable mesh upper and ultra-responsive lightweight foam sole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 24,
    featured: true,
    isNew: true,
    sku: 'MS-RUN-01'
  },
  {
    id: 2,
    name: 'MONO STREET 02',
    category: 'Lifestyle',
    price: 2590,
    description: 'Clean streetwear sneakers for everyday casual style. Built from premium full-grain synthetic leather with a durable vulcanized rubber outsole.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 18,
    featured: true,
    isNew: false,
    sku: 'MS-STR-02'
  },
  {
    id: 3,
    name: 'MONO AIR 03',
    category: 'Running',
    price: 3290,
    description: 'Lightweight sneakers with responsive cushioning. Features our signature pressurized shock-absorbing midsole for all-day cloud comfort.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 15,
    featured: true,
    isNew: true,
    sku: 'MS-AIR-03'
  },
  {
    id: 4,
    name: 'MONO COURT 04',
    category: 'Basketball',
    price: 3490,
    description: 'Performance basketball sneakers with excellent ankle support. High-top padded collar and multi-directional herringbone traction tread.',
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 12,
    featured: true,
    isNew: false,
    sku: 'MS-CRT-04'
  },
  {
    id: 5,
    name: 'MONO TRAIN 05',
    category: 'Training',
    price: 2790,
    description: 'Versatile training shoes designed for gym and daily workouts. Wide stable base with reinforced lateral sidewalls for dynamic movements.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 20,
    featured: false,
    isNew: false,
    sku: 'MS-TRN-05'
  },
  {
    id: 6,
    name: 'MONO CLASSIC 06',
    category: 'Lifestyle',
    price: 2390,
    description: 'Minimal classic sneakers that match any outfit. Low-profile silhouette with clean contrast stitch accents and memory foam insole.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 30,
    featured: false,
    isNew: false,
    sku: 'MS-CLS-06'
  },
  {
    id: 7,
    name: 'MONO SPEED 07',
    category: 'Running',
    price: 3590,
    description: 'Lightweight performance shoes built for speed and comfort. Features propulsion carbon plate geometry and featherlight knit mesh.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 9,
    featured: false,
    isNew: true,
    sku: 'MS-SPD-07'
  },
  {
    id: 8,
    name: 'MONO URBAN 08',
    category: 'Lifestyle',
    price: 2690,
    description: 'Modern urban sneakers with a clean monochrome design. Chunky aesthetic midsole paired with water-resistant ripstop overlays.',
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 14,
    featured: false,
    isNew: false,
    sku: 'MS-URB-08'
  },
  {
    id: 9,
    name: 'MONO FORCE 09',
    category: 'Training',
    price: 3090,
    description: 'Stable training sneakers designed for demanding workouts. Reinforced toe cap and midfoot lock strap for high-intensity gym sessions.',
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [40, 41, 42, 43, 44],
    stock: 16,
    featured: false,
    isNew: false,
    sku: 'MS-FRC-09'
  },
  {
    id: 10,
    name: 'MONO ELITE 10',
    category: 'Lifestyle',
    price: 3990,
    description: 'Premium sneakers combining minimalist design and everyday comfort. Handcrafted finish with Italian calfskin trim and stealth tonal branding.',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 8,
    featured: false,
    isNew: true,
    sku: 'MS-ELT-10'
  }
];

export const SAMPLE_PRESET_IMAGES = [
  { name: 'Runner Stealth', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Street Minimal', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Air Monochrome', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Court High', url: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Classic Leather', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Chunky Urban', url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000&auto=format&fit=crop' }
];
