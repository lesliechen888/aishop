import { Product } from '@/types';

// 产品图片数据库
const productImages = {
  bras: [
    '/images/products/bras/lace-bra-black.jpg',
    '/images/products/bras/push-up-bra-nude.jpg',
    '/images/products/bras/sports-bra-white.jpg',
    '/images/products/bras/wireless-bra-pink.jpg',
    '/images/products/bras/balconette-bra-red.jpg',
    '/images/products/bras/t-shirt-bra-beige.jpg',
    '/images/products/bras/minimizer-bra-black.jpg',
    '/images/products/bras/strapless-bra-nude.jpg',
  ],
  underwear: [
    '/images/products/underwear/cotton-briefs-white.jpg',
    '/images/products/underwear/lace-panties-black.jpg',
    '/images/products/underwear/boyshorts-gray.jpg',
    '/images/products/underwear/thong-nude.jpg',
    '/images/products/underwear/hipster-pink.jpg',
    '/images/products/underwear/bikini-blue.jpg',
    '/images/products/underwear/high-waist-black.jpg',
    '/images/products/underwear/seamless-beige.jpg',
  ],
  sleepwear: [
    '/images/products/sleepwear/silk-pajamas-navy.jpg',
    '/images/products/sleepwear/cotton-nightgown-white.jpg',
    '/images/products/sleepwear/satin-robe-pink.jpg',
    '/images/products/sleepwear/flannel-set-plaid.jpg',
    '/images/products/sleepwear/bamboo-shorts-gray.jpg',
    '/images/products/sleepwear/modal-camisole-black.jpg',
    '/images/products/sleepwear/jersey-pants-blue.jpg',
    '/images/products/sleepwear/lace-chemise-red.jpg',
  ],
  activewear: [
    '/images/products/activewear/sports-bra-black.jpg',
    '/images/products/activewear/yoga-leggings-gray.jpg',
    '/images/products/activewear/running-shorts-pink.jpg',
    '/images/products/activewear/tank-top-white.jpg',
    '/images/products/activewear/compression-tights-blue.jpg',
    '/images/products/activewear/sports-crop-purple.jpg',
    '/images/products/activewear/mesh-leggings-black.jpg',
    '/images/products/activewear/racerback-bra-green.jpg',
  ],
  swimwear: [
    '/images/products/swimwear/bikini-set-tropical.jpg',
    '/images/products/swimwear/one-piece-black.jpg',
    '/images/products/swimwear/triangle-bikini-red.jpg',
    '/images/products/swimwear/high-waist-bikini-blue.jpg',
    '/images/products/swimwear/bandeau-bikini-white.jpg',
    '/images/products/swimwear/sporty-swimsuit-navy.jpg',
    '/images/products/swimwear/cut-out-swimsuit-pink.jpg',
    '/images/products/swimwear/halter-bikini-yellow.jpg',
  ],
  accessories: [
    '/images/products/accessories/silk-scarf-floral.jpg',
    '/images/products/accessories/jewelry-set-gold.jpg',
    '/images/products/accessories/hair-accessories-pearl.jpg',
    '/images/products/accessories/handbag-leather-black.jpg',
    '/images/products/accessories/sunglasses-aviator.jpg',
    '/images/products/accessories/watch-rose-gold.jpg',
    '/images/products/accessories/belt-chain-silver.jpg',
    '/images/products/accessories/earrings-diamond.jpg',
  ],
};

// 品牌名称
const brands = [
  'Victoria\'s Secret', 'Calvin Klein', 'Tommy Hilfiger', 'La Perla', 'Agent Provocateur',
  'Intimissimi', 'Triumph', 'Wacoal', 'Chantelle', 'Simone Pérèle', 'Aubade', 'Lise Charmel',
  'Hanky Panky', 'Cosabella', 'Natori', 'Spanx', 'ThirdLove', 'Savage X Fenty', 'Skims',
  'Aerie', 'Soma', 'Jockey', 'Hanes', 'Fruit of the Loom', 'Maidenform', 'Bali', 'Playtex',
  'Warner\'s', 'Vanity Fair', 'Olga', 'Barely There', 'Lilyette', 'Glamorise', 'Elomi',
  'Panache', 'Freya', 'Fantasie', 'Curvy Kate', 'Bravissimo', 'Ewa Michalak', 'Comexim',
  'Prima Donna', 'Marie Jo', 'Empreinte', 'Lemon', 'Huit', 'Passionata', 'Andres Sarda'
];

// 材质
const materials = [
  'Cotton', 'Silk', 'Lace', 'Satin', 'Modal', 'Bamboo', 'Microfiber', 'Nylon', 'Polyester',
  'Spandex', 'Elastane', 'Lycra', 'Mesh', 'Tulle', 'Chiffon', 'Jersey', 'Flannel', 'Cashmere'
];

// 颜色
const colors = [
  'Black', 'White', 'Nude', 'Pink', 'Red', 'Blue', 'Navy', 'Gray', 'Beige', 'Purple',
  'Green', 'Yellow', 'Orange', 'Brown', 'Ivory', 'Coral', 'Mint', 'Lavender', 'Rose Gold'
];

// 尺码
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32A', '32B', '32C', '32D', '34A', '34B', '34C', '34D', '36A', '36B', '36C', '36D'];

// 生成随机产品数据的辅助函数
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function getRandomRating(): number {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 - 5.0
}

function getRandomReviewCount(): number {
  return Math.floor(Math.random() * 2000) + 10;
}

function generateProductName(category: string, brand: string, material: string, color: string): string {
  const categoryNames = {
    'categories.bras': ['Bra', 'Bralette', 'Push-Up Bra', 'Sports Bra', 'Wireless Bra', 'T-Shirt Bra'],
    'categories.underwear': ['Panties', 'Briefs', 'Thong', 'Boyshorts', 'Hipster', 'Bikini'],
    'categories.sleepwear': ['Pajamas', 'Nightgown', 'Robe', 'Camisole', 'Sleep Set', 'Chemise'],
    'categories.activewear': ['Sports Bra', 'Leggings', 'Tank Top', 'Shorts', 'Crop Top', 'Tights'],
    'categories.swimwear': ['Bikini', 'Swimsuit', 'One-Piece', 'Tankini', 'Cover-Up', 'Swim Top'],
    'categories.accessories': ['Scarf', 'Jewelry', 'Handbag', 'Sunglasses', 'Watch', 'Belt']
  };
  
  const productType = getRandomElement(categoryNames[category as keyof typeof categoryNames]);
  return `${brand} ${material} ${color} ${productType}`;
}

function generateProductDescription(category: string, material: string): string {
  const descriptions = {
    'categories.bras': [
      `Luxurious ${material.toLowerCase()} bra with superior comfort and support`,
      `Elegant ${material.toLowerCase()} bra designed for all-day comfort`,
      `Premium ${material.toLowerCase()} bra with seamless construction`,
      `Sophisticated ${material.toLowerCase()} bra with perfect fit technology`
    ],
    'categories.underwear': [
      `Comfortable ${material.toLowerCase()} underwear for everyday wear`,
      `Soft ${material.toLowerCase()} panties with smooth finish`,
      `Premium ${material.toLowerCase()} underwear with moisture-wicking properties`,
      `Elegant ${material.toLowerCase()} underwear with delicate details`
    ],
    'categories.sleepwear': [
      `Luxurious ${material.toLowerCase()} sleepwear for ultimate comfort`,
      `Soft ${material.toLowerCase()} pajamas perfect for relaxation`,
      `Premium ${material.toLowerCase()} nightwear with elegant design`,
      `Comfortable ${material.toLowerCase()} sleepwear for peaceful nights`
    ],
    'categories.activewear': [
      `High-performance ${material.toLowerCase()} activewear for intense workouts`,
      `Breathable ${material.toLowerCase()} sportswear with moisture management`,
      `Flexible ${material.toLowerCase()} activewear for maximum mobility`,
      `Supportive ${material.toLowerCase()} sportswear for active lifestyle`
    ],
    'categories.swimwear': [
      `Stylish ${material.toLowerCase()} swimwear perfect for beach days`,
      `Designer ${material.toLowerCase()} swimsuit with UV protection`,
      `Fashionable ${material.toLowerCase()} bikini for summer vacation`,
      `Elegant ${material.toLowerCase()} swimwear with flattering fit`
    ],
    'categories.accessories': [
      `Premium ${material.toLowerCase()} accessory with timeless design`,
      `Elegant ${material.toLowerCase()} accessory for sophisticated style`,
      `Luxury ${material.toLowerCase()} accessory with exquisite craftsmanship`,
      `Designer ${material.toLowerCase()} accessory for fashion-forward look`
    ]
  };
  
  return getRandomElement(descriptions[category as keyof typeof descriptions]);
}

// 生成大量产品数据
export function generateProductDatabase(count: number = 5000): Product[] {
  const products: Product[] = [];
  const categories = ['categories.bras', 'categories.underwear', 'categories.sleepwear', 'categories.activewear', 'categories.swimwear', 'categories.accessories'];
  
  for (let i = 1; i <= count; i++) {
    const category = getRandomElement(categories);
    const brand = getRandomElement(brands);
    const material = getRandomElement(materials);
    const color = getRandomElement(colors);
    const price = getRandomPrice(15, 299);
    const hasDiscount = Math.random() < 0.3; // 30% chance of discount
    const discount = hasDiscount ? Math.floor(Math.random() * 50) + 10 : undefined;
    const originalPrice = hasDiscount ? Math.round(price / (1 - discount! / 100) * 100) / 100 : undefined;
    
    const categoryKey = category.split('.')[1] as keyof typeof productImages;
    const images = productImages[categoryKey] || productImages.bras;
    
    const product: Product = {
      id: i.toString(),
      name: `products.generated.${i}.name`,
      description: `products.generated.${i}.description`,
      price,
      originalPrice,
      currency: 'USD',
      images: [getRandomElement(images), getRandomElement(images)],
      rating: getRandomRating(),
      reviewCount: getRandomReviewCount(),
      category,
      tags: [material.toLowerCase(), color.toLowerCase(), brand.toLowerCase().replace(/[^a-z0-9]/g, '')],
      inStock: Math.random() > 0.05, // 95% in stock
      discount,
      // 额外的产品信息
      brand,
      material,
      color,
      sizes: [getRandomElement(sizes), getRandomElement(sizes), getRandomElement(sizes)],
      actualName: generateProductName(category, brand, material, color),
      actualDescription: generateProductDescription(category, material)
    };
    
    products.push(product);
  }
  
  return products;
}

// 生成产品数据库
export const productDatabase = generateProductDatabase(5000);

// 导出前100个作为热销产品
export const hotProductsFromDB = productDatabase.slice(0, 100);

// 按分类导出产品
export const productsByCategory = {
  bras: productDatabase.filter(p => p.category === 'categories.bras'),
  underwear: productDatabase.filter(p => p.category === 'categories.underwear'),
  sleepwear: productDatabase.filter(p => p.category === 'categories.sleepwear'),
  activewear: productDatabase.filter(p => p.category === 'categories.activewear'),
  swimwear: productDatabase.filter(p => p.category === 'categories.swimwear'),
  accessories: productDatabase.filter(p => p.category === 'categories.accessories'),
};
