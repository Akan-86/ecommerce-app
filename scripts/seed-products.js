// scripts/seed-products.js
// Usage: node scripts/seed-products.js

// NOTE:
// Using optimized Unsplash images with consistent sizing.
// For production, replace with curated or hosted assets.

require("dotenv").config({ path: ".env.local" });

const admin = require("firebase-admin");

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("Missing FIREBASE_PROJECT_ID in .env.local");
}

// Initialize Firebase Admin using env vars
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

// 25+ Tech Premium style products
const products = [
  // Electronics
  {
    title: "Wireless Noise Cancelling Headphones",
    price: 299,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Mechanical Keyboard Pro",
    price: 189,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Ergonomic Wireless Mouse",
    price: 79,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "4K Ultra Monitor",
    price: 499,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4c9b9a9b2a3?auto=format&fit=crop&w=800&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Bluetooth Speaker",
    price: 129,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=800&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "USB-C Hub",
    price: 59,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1587202372775-9893a6f6a7b2?auto=format&fit=crop&w=800&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Portable SSD",
    price: 199,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "HD Webcam",
    price: 89,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80",
    description:
      "Precision-crafted technology designed for modern everyday performance.",
    brand: "Velora",
    rating: 4.6,
  },

  // Fashion
  {
    title: "Minimal Hoodie",
    price: 89,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elevated essentials balancing comfort, simplicity, and refined style.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Essential T-Shirt",
    price: 39,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elevated essentials balancing comfort, simplicity, and refined style.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Modern Jacket",
    price: 159,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=800&q=80",
    description:
      "Elevated essentials balancing comfort, simplicity, and refined style.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Slim Fit Pants",
    price: 99,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    description:
      "Elevated essentials balancing comfort, simplicity, and refined style.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Minimal Sneakers",
    price: 129,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elevated essentials balancing comfort, simplicity, and refined style.",
    brand: "Velora",
    rating: 4.6,
  },

  // Home
  {
    title: "Modern Desk Lamp",
    price: 129,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    description:
      "Thoughtfully designed objects that bring calm and sophistication to your space.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Ergonomic Chair",
    price: 349,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1582582429416-8a1c1d9a6f8f?auto=format&fit=crop&w=800&q=80",
    description:
      "Thoughtfully designed objects that bring calm and sophistication to your space.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Minimal Wall Clock",
    price: 59,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    description:
      "Thoughtfully designed objects that bring calm and sophistication to your space.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Desk Organizer",
    price: 49,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
    description:
      "Thoughtfully designed objects that bring calm and sophistication to your space.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Ambient Light Bar",
    price: 89,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    description:
      "Thoughtfully designed objects that bring calm and sophistication to your space.",
    brand: "Velora",
    rating: 4.6,
  },

  // Accessories
  {
    title: "Tech Backpack",
    price: 149,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1514474959185-1472d4c4e0b3?auto=format&fit=crop&w=800&q=80",
    description: "Premium accessories crafted for seamless modern living.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Smart Watch",
    price: 249,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
    description: "Premium accessories crafted for seamless modern living.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Leather Wallet",
    price: 79,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    description: "Premium accessories crafted for seamless modern living.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Tech Pouch",
    price: 39,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    description: "Premium accessories crafted for seamless modern living.",
    brand: "Velora",
    rating: 4.6,
  },
  {
    title: "Premium Sunglasses",
    price: 119,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    description: "Premium accessories crafted for seamless modern living.",
    brand: "Velora",
    rating: 4.6,
  },
];

async function seed() {
  try {
    console.log("Seeding products...");

    const batch = db.batch();

    products.forEach((product) => {
      const slug = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const ref = db.collection("products").doc();
      batch.set(ref, {
        ...product,
        slug,
        stock: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await batch.commit();

    console.log("DONE ✅ Products inserted:", products.length);
    process.exit(0);
  } catch (err) {
    console.error("ERROR seeding:", err);
    process.exit(1);
  }
}

seed();
