import type { Category, Order, Product } from "../types";

const collectImagePool = (items: { image: string; images?: string[] }[]): string[] => [
  ...new Set(
    items.flatMap((item) => [item.image, ...(item.images ?? [])])
  ),
];

const getTestImage = (seed: string, pool: string[]): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
};

const getTestImages = (seed: string, pool: string[], count = 3): string[] => {
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(getTestImage(`${seed}-${i}`, pool));
  }
  return [...new Set(images)];
};

const baseCategories: Category[] = [
  {
    id: "1",
    slug: "boys",
    title: "Boys",
    image:
      "https://images.unsplash.com/photo-1522771930-4d8fbf21727b?w=600&h=800&fit=crop",
  },
  {
    id: "2",
    slug: "girls",
    title: "Girls",
    image:
      "https://images.unsplash.com/photo-1519689372903-d0f74787a7be?w=600&h=800&fit=crop",
  },
  {
    id: "3",
    slug: "newborn essentials",
    title: "Newborn Essentials",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=800&fit=crop",
  },
  {
    id: "4",
    slug: "unisex",
    title: "Unisex",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=800&fit=crop",
  },
];

const baseProducts: Product[] = [
  {
    id: "1",
    name: "Organic Cotton Onesie",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1522771930-4d8fbf21727b?w=600&h=750&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522771930-4d8fbf21727b?w=600&h=750&fit=crop",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=750&fit=crop",
    ],
    category: "newborn essentials",
    ageGroup: "0-3m",
    sizes: ["NB", "0-3M", "3-6M"],
    description:
      "Ultra-soft organic cotton onesie with gentle snap closures. Perfect for delicate unisex skin.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Floral Romper Set",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1519689372903-d0f74787a7be?w=600&h=750&fit=crop",
    category: "girls",
    ageGroup: "3-6m",
    sizes: ["3-6M", "6-12M"],
    description:
      "Delicate floral print romper with matching headband. Made from breathable cotton blend.",
    isFeatured: true,
  },
  {
    id: "3",
    name: "Classic Knit Cardigan",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=750&fit=crop",
    category: "boys",
    ageGroup: "6-12m",
    sizes: ["6-12M", "12-24M"],
    description:
      "Timeless knit cardigan in soft neutral tones. Ideal for layering in any season.",
    isFeatured: true,
  },
  {
    id: "4",
    name: "Muslin Swaddle Blanket",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=750&fit=crop",
    category: "unisex",
    ageGroup: "0-3m",
    sizes: ["One Size"],
    description:
      "Lightweight muslin swaddle blanket. Generously sized for versatile use.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Linen Summer Dress",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=750&fit=crop",
    category: "girls",
    ageGroup: "6-12m",
    sizes: ["6-12M", "12-24M"],
    description:
      "Breathable linen dress with delicate embroidery. Perfect for warm summer days.",
    isNew: true,
  },
  {
    id: "6",
    name: "Striped Bodysuit Pack",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1519689372903-d0f74787a7be?w=600&h=750&fit=crop",
    category: "boys",
    ageGroup: "0-3m",
    sizes: ["NB", "0-3M", "3-6M"],
    description:
      "Set of three classic striped bodysuits. Soft, durable, and easy to care for.",
  },
  {
    id: "7",
    name: "Cashmere Booties",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=750&fit=crop",
    category: "unisex",
    ageGroup: "0-3m",
    sizes: ["0-6M", "6-12M"],
    description:
      "Luxuriously soft cashmere booties to keep tiny feet warm and cozy.",
  },
  {
    id: "8",
    name: "Velvet Party Outfit",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=750&fit=crop",
    category: "girls",
    ageGroup: "12-24m",
    sizes: ["12-24M"],
    description:
      "Elegant velvet outfit for special occasions. Includes dress and matching bow.",
    isNew: true,
  },
];

const testImagePool = collectImagePool([...baseCategories, ...baseProducts]);

export const categories: Category[] = baseCategories.map((category) => ({
  ...category,
  image: getTestImage(`category-${category.id}`, testImagePool),
}));

export const products: Product[] = baseProducts.map((product) => {
  const image = getTestImage(`product-${product.id}`, testImagePool);
  return {
    ...product,
    image,
    images: getTestImages(`product-gallery-${product.id}`, testImagePool),
  };
});

export const orders: Order[] = [
  {
    id: "BF-2024-001",
    date: "2024-11-15",
    status: "delivered",
    total: 77,
    shippingAddress: {
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "555-0123",
      address: "123 Maple Street",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
    },
    items: [
      { product: products[0]!, quantity: 1, size: "0-3M" },
      { product: products[3]!, quantity: 1, size: "One Size" },
    ],
  },
  {
    id: "BF-2024-002",
    date: "2024-12-02",
    status: "shipped",
    total: 45,
    shippingAddress: {
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "555-0123",
      address: "123 Maple Street",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
    },
    items: [{ product: products[1]!, quantity: 1, size: "3-6M" }],
  },
];

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.isFeatured);

export const getNewArrivals = (): Product[] =>
  products.filter((p) => p.isNew);

export const getRelatedProducts = (
  product: Product,
  limit = 4
): Product[] =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
