export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextResponse, NextRequest } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

const db = getFirestore(adminApp);

const MOCK_PRODUCTS = [
  // Electronics
  {
    id: "tech-1",
    title: "Wireless Noise Cancelling Headphones",
    price: 299,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    description: "Immersive sound with active noise cancellation.",
  },
  {
    id: "tech-2",
    title: "Mechanical Keyboard Pro",
    price: 189,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    description: "Precision typing with premium switches.",
  },
  {
    id: "tech-3",
    title: "Ergonomic Wireless Mouse",
    price: 79,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    description: "Comfort and control for long sessions.",
  },
  {
    id: "tech-4",
    title: "4K Ultra Monitor",
    price: 499,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4c9b9a9b2a3",
    description: "Crisp visuals for work and play.",
  },
  {
    id: "tech-5",
    title: "Bluetooth Speaker",
    price: 129,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1585386959984-a41552231658",
    description: "Rich sound in a compact design.",
  },

  // Fashion
  {
    id: "fashion-1",
    title: "Minimal Hoodie",
    price: 89,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1520975922284-9d3c1e6e4b8a",
    description: "Clean look, everyday comfort.",
  },
  {
    id: "fashion-2",
    title: "Essential T-Shirt",
    price: 39,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1520975693411-3f3c1a7c9f4d",
    description: "Soft fabric, timeless style.",
  },
  {
    id: "fashion-3",
    title: "Modern Jacket",
    price: 159,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1516822003754-cca485356ecb",
    description: "Layer up with precision.",
  },

  // Home
  {
    id: "home-1",
    title: "Modern Desk Lamp",
    price: 129,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    description: "Focused lighting for productivity.",
  },
  {
    id: "home-2",
    title: "Ergonomic Chair",
    price: 349,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1582582429416-8a1c1d9a6f8f",
    description: "Comfort meets design.",
  },
  {
    id: "home-3",
    title: "Minimal Wall Clock",
    price: 59,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    description: "Time, simplified.",
  },

  // Accessories
  {
    id: "acc-1",
    title: "Tech Backpack",
    price: 149,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1514474959185-1472d4c4e0b3",
    description: "Carry essentials with style.",
  },
  {
    id: "acc-2",
    title: "Smart Watch",
    price: 249,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    description: "Stay connected on the go.",
  },
  {
    id: "acc-3",
    title: "Leather Wallet",
    price: 79,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description: "Minimal and refined.",
  },

  // Extra items to reach density
  {
    id: "tech-6",
    title: "USB-C Hub",
    price: 59,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-9893a6f6a7b2",
    description: "Expand your setup.",
  },
  {
    id: "tech-7",
    title: "Portable SSD",
    price: 199,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
    description: "Speed and reliability.",
  },
  {
    id: "tech-8",
    title: "Webcam HD",
    price: 89,
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1587614382346-ac1d8b7d2f84",
    description: "Clear video calls.",
  },

  {
    id: "fashion-4",
    title: "Slim Fit Pants",
    price: 99,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    description: "Modern tailoring.",
  },
  {
    id: "fashion-5",
    title: "Sneakers Minimal",
    price: 129,
    category: "fashion",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552",
    description: "Everyday performance.",
  },

  {
    id: "home-4",
    title: "Desk Organizer",
    price: 49,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    description: "Declutter your space.",
  },
  {
    id: "home-5",
    title: "Ambient Light Bar",
    price: 89,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    description: "Set the mood.",
  },

  {
    id: "acc-4",
    title: "Tech Pouch",
    price: 39,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    description: "Organize cables and gear.",
  },
  {
    id: "acc-5",
    title: "Sunglasses Premium",
    price: 119,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    description: "Sharp look, UV protection.",
  },
];

export async function GET(req: NextRequest) {
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.warn("Firebase env missing → returning mock products");
      return NextResponse.json(MOCK_PRODUCTS);
    }
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(
      searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER
    );
    const sort = searchParams.get("sort"); // 'price-asc' | 'price-desc' | 'new'
    const search = (searchParams.get("search") || "").toLowerCase();

    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      console.warn("No products in DB → returning mock data");
      return NextResponse.json(MOCK_PRODUCTS);
    }

    let products = snapshot.docs.map((doc) => {
      const data = doc.data() as any;

      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || null;

      const updatedAt =
        data.updatedAt && typeof data.updatedAt.toDate === "function"
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || null;

      const thumbnail =
        typeof data.thumbnail === "string" && data.thumbnail.trim().length > 0
          ? data.thumbnail
          : null;

      const images = Array.isArray(data.images)
        ? data.images.filter(
            (img: any) => typeof img === "string" && img.trim().length > 0
          )
        : [];

      return {
        id: doc.id,
        ...data,
        thumbnail,
        images,
        createdAt,
        updatedAt,
      };
    }) as any[];

    // Search by title or description
    if (search) {
      products = products.filter((p) => {
        const title = String(p.title || "").toLowerCase();
        const description = String(p.description || "").toLowerCase();

        return title.includes(search) || description.includes(search);
      });
    }

    // Filter by category
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    // Filter by price range
    products = products.filter((p) => {
      const price = Number(p.price || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // Sort
    if (sort === "price-asc") {
      products = products.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price-desc") {
      products = products.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sort === "new") {
      products = products.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    return NextResponse.json(products, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, category, stock, thumbnail } = body;

    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    const docRef = await db.collection("products").add({
      title,
      description,
      price,
      category,
      stock,
      thumbnail: thumbnail || "",
      images: thumbnail ? [thumbnail] : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
