// scripts/seed-products.js
// Usage: node scripts/seed-products.js

const admin = require("firebase-admin");

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
    thumbnail: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    description: "Immersive sound with active noise cancellation.",
  },
  {
    title: "Mechanical Keyboard Pro",
    price: 189,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    description: "Precision typing with premium switches.",
  },
  {
    title: "Ergonomic Wireless Mouse",
    price: 79,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    description: "Comfort and control for long sessions.",
  },
  {
    title: "4K Ultra Monitor",
    price: 499,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4c9b9a9b2a3",
    description: "Crisp visuals for work and play.",
  },
  {
    title: "Bluetooth Speaker",
    price: 129,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1585386959984-a41552231658",
    description: "Rich sound in a compact design.",
  },
  {
    title: "USB-C Hub",
    price: 59,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-9893a6f6a7b2",
    description: "Expand your setup.",
  },
  {
    title: "Portable SSD",
    price: 199,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
    description: "Speed and reliability.",
  },
  {
    title: "HD Webcam",
    price: 89,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587614382346-ac1d8b7d2f84",
    description: "Clear video calls.",
  },

  // Fashion
  {
    title: "Minimal Hoodie",
    price: 89,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1520975922284-9d3c1e6e4b8a",
    description: "Clean look, everyday comfort.",
  },
  {
    title: "Essential T-Shirt",
    price: 39,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1520975693411-3f3c1a7c9f4d",
    description: "Soft fabric, timeless style.",
  },
  {
    title: "Modern Jacket",
    price: 159,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1516822003754-cca485356ecb",
    description: "Layer up with precision.",
  },
  {
    title: "Slim Fit Pants",
    price: 99,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    description: "Modern tailoring.",
  },
  {
    title: "Minimal Sneakers",
    price: 129,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552",
    description: "Everyday performance.",
  },

  // Home
  {
    title: "Modern Desk Lamp",
    price: 129,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    description: "Focused lighting for productivity.",
  },
  {
    title: "Ergonomic Chair",
    price: 349,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1582582429416-8a1c1d9a6f8f",
    description: "Comfort meets design.",
  },
  {
    title: "Minimal Wall Clock",
    price: 59,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    description: "Time, simplified.",
  },
  {
    title: "Desk Organizer",
    price: 49,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    description: "Declutter your space.",
  },
  {
    title: "Ambient Light Bar",
    price: 89,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    description: "Set the mood.",
  },

  // Accessories
  {
    title: "Tech Backpack",
    price: 149,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1514474959185-1472d4c4e0b3",
    description: "Carry essentials with style.",
  },
  {
    title: "Smart Watch",
    price: 249,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    description: "Stay connected on the go.",
  },
  {
    title: "Leather Wallet",
    price: 79,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description: "Minimal and refined.",
  },
  {
    title: "Tech Pouch",
    price: 39,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    description: "Organize cables and gear.",
  },
  {
    title: "Premium Sunglasses",
    price: 119,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    description: "Sharp look, UV protection.",
  },
];

async function seed() {
  try {
    console.log("Seeding products...");

    const batch = db.batch();

    products.forEach((product) => {
      const ref = db.collection("products").doc();
      batch.set(ref, {
        ...product,
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
