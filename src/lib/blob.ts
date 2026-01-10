import { put } from "@vercel/blob";

/**
 * Centralized Vercel Blob helper
 * - Safe for Server Actions / Route Handlers
 * - Returns public URL
 * - Enforces basic image validation
 */

export type UploadOptions = {
  folder?: string;
  contentType?: string;
  maxSizeMB?: number;
};

const DEFAULT_MAX_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/**
 * Validate image before upload
 */
function validateImage(file: File, maxSizeMB: number) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid image type. Allowed: JPG, PNG, WEBP, AVIF");
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Image size must be under ${maxSizeMB}MB`);
  }
}

/**
 * Upload image/file to Vercel Blob and return public URL
 */
export async function uploadToBlob(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const {
    folder = "uploads",
    contentType = file.type,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
  } = options;

  validateImage(file, maxSizeMB);

  const safeFileName = file.name.replace(/\s+/g, "-").toLowerCase();
  const pathname = `${folder}/${Date.now()}-${safeFileName}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType,
  });

  return blob.url;
}

/**
 * Helper for product images
 */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadToBlob(file, {
    folder: "products",
    maxSizeMB: 5,
  });
}

/**
 * Helper for hero / marketing images
 */
export async function uploadHeroImage(file: File): Promise<string> {
  return uploadToBlob(file, {
    folder: "hero",
    maxSizeMB: 8,
  });
}
