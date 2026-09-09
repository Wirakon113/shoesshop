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
  },
  {
    id: 11,
    name: 'MONO STRIDE 11',
    category: 'Running',
    price: 3490,
    description: 'High-rebound marathon running shoe with dual-density nitrogen infused foam and aerodynamic heel split.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 22,
    featured: true,
    isNew: true,
    sku: 'MS-STR-11'
  },
  {
    id: 12,
    name: 'MONO RETRO 12',
    category: 'Lifestyle',
    price: 2790,
    description: 'Vintage 90s court silhouette re-imagined in raw tumbled leather with off-white vintage midsole.',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 19,
    featured: false,
    isNew: false,
    sku: 'MS-RTO-12'
  },
  {
    id: 13,
    name: 'MONO SLAM 13',
    category: 'Basketball',
    price: 3890,
    description: 'Explosive court basketball sneaker engineered with carbon-fiber shank plate and 360-degree padded ankle collar.',
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44],
    stock: 14,
    featured: true,
    isNew: true,
    sku: 'MS-SLM-13'
  },
  {
    id: 14,
    name: 'MONO CROSS 14',
    category: 'Training',
    price: 2990,
    description: 'Heavy lifting and HIIT cross-training footwear with hyper-stable flat rubber base and abrasion-resistant mesh.',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 17,
    featured: false,
    isNew: false,
    sku: 'MS-CRS-14'
  },
  {
    id: 15,
    name: 'MONO CARBON 15',
    category: 'Running',
    price: 4490,
    description: 'Flagship race-day road sneaker with full-length curved carbon fiber propulsion plate and flyweight matrix upper.',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 11,
    featured: true,
    isNew: true,
    sku: 'MS-CRB-15'
  },
  {
    id: 16,
    name: 'MONO VIBE 16',
    category: 'Lifestyle',
    price: 2490,
    description: 'Clean monochrome low-top crafted for effortless daily styling with ultra-plush ortholite insole.',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 25,
    featured: false,
    isNew: false,
    sku: 'MS-VIB-16'
  },
  {
    id: 17,
    name: 'MONO DUNK HIGH 17',
    category: 'Basketball',
    price: 4190,
    description: 'Heritage high-profile hoops silhouette built with genuine full-grain leather overlays and cupsole cushioning.',
    image: 'https://images.unsplash.com/photo-1586525198428-225f6f12cff5?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1586525198428-225f6f12cff5?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 13,
    featured: false,
    isNew: true,
    sku: 'MS-DKH-17'
  },
  {
    id: 18,
    name: 'MONO LIFT 18',
    category: 'Training',
    price: 3290,
    description: 'Engineered powerlifting shoe with zero-drop wide toe box and dual midfoot locking straps for maximum ground connection.',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 16,
    featured: false,
    isNew: false,
    sku: 'MS-LFT-18'
  },
  {
    id: 19,
    name: 'MONO GLIDE 19',
    category: 'Running',
    price: 3190,
    description: 'Smooth rocker sole design that propels your stride forward on daily 5K to 10K pavement runs.',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 20,
    featured: false,
    isNew: false,
    sku: 'MS-GLD-19'
  },
  {
    id: 20,
    name: 'MONO CANVAS 20',
    category: 'Lifestyle',
    price: 2190,
    description: 'Everyday lightweight 12oz canvas sneaker with vulcanized waffle rubber tread and reinforced brass eyelets.',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 28,
    featured: false,
    isNew: false,
    sku: 'MS-CNV-20'
  },
  {
    id: 21,
    name: 'MONO HOOPS 21',
    category: 'Basketball',
    price: 3690,
    description: 'Agile low-cut basketball shoe engineered for fast guards with responsive forefoot zoom unit and herringbone grip.',
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44],
    stock: 15,
    featured: true,
    isNew: true,
    sku: 'MS-HPS-21'
  },
  {
    id: 22,
    name: 'MONO AGILITY 22',
    category: 'Training',
    price: 2890,
    description: 'Dynamic indoor athletic training shoes built with lateral TPU stabilization wraps for multi-directional agility drills.',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 21,
    featured: false,
    isNew: false,
    sku: 'MS-AGL-22'
  },
  {
    id: 23,
    name: 'MONO PULSE 23',
    category: 'Running',
    price: 3390,
    description: 'Ultra-plush long-distance road shoe packed with 38mm heel stack cushioning for endless cloud-like shock absorption.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 18,
    featured: false,
    isNew: true,
    sku: 'MS-PLS-23'
  },
  {
    id: 24,
    name: 'MONO SUEDE 24',
    category: 'Lifestyle',
    price: 2890,
    description: 'Luxurious brushed premium suede silhouette with contrast edge piping and padded moisture-wicking sockliner.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 14,
    featured: true,
    isNew: false,
    sku: 'MS-SUD-24'
  },
  {
    id: 25,
    name: 'MONO PIVOT 25',
    category: 'Basketball',
    price: 3990,
    description: 'Streetball-ready high abrasion outsole with targeted perimeter lockdown pods for quick crossovers.',
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44],
    stock: 12,
    featured: false,
    isNew: true,
    sku: 'MS-PVT-25'
  },
  {
    id: 26,
    name: 'MONO FLEX 26',
    category: 'Training',
    price: 2690,
    description: 'Natural movement training sneaker featuring segmented deep flex grooves across the sole for barefoot agility feel.',
    image: 'https://images.unsplash.com/photo-1551107696-a4b085a6d9a0?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1551107696-a4b085a6d9a0?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 23,
    featured: false,
    isNew: false,
    sku: 'MS-FLX-26'
  },
  {
    id: 27,
    name: 'MONO PEAK 27',
    category: 'Running',
    price: 3790,
    description: 'All-terrain hybrid trail running sneaker fitted with 4.5mm multi-directional lugs and water-shedding ripstop.',
    image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 10,
    featured: false,
    isNew: true,
    sku: 'MS-PEK-27'
  },
  {
    id: 28,
    name: 'MONO CHUNKY 28',
    category: 'Lifestyle',
    price: 3290,
    description: 'Architectural layered dad sneaker with sculpted wavy EVA midsole and retro monochrome reflective accents.',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 19,
    featured: true,
    isNew: false,
    sku: 'MS-CHK-28'
  },
  {
    id: 29,
    name: 'MONO FLIGHT 29',
    category: 'Basketball',
    price: 4290,
    description: 'Tournament-ready performance shoe featuring full pressurized air cushioning and lightweight jacquard weave.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44],
    stock: 9,
    featured: false,
    isNew: true,
    sku: 'MS-FLT-29'
  },
  {
    id: 30,
    name: 'MONO ENDURE 30',
    category: 'Training',
    price: 3190,
    description: 'Endurance functional fitness shoe built with rope-climb guard wrap and high-density heel cup for squat stability.',
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 15,
    featured: false,
    isNew: false,
    sku: 'MS-EDR-30'
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
