// demoData,
// Turns the demo data files(categories.ts,product.ts) into records shaped like the models, ready for seed.ts to save, Nothing here talks to MonogDb.

import { Types } from "mongoose";
import { PHOTO_FOLDER, photoUri } from "../config/cloudinary";
import { categories } from "./categories";
import { products, SeedProduct } from "./products";
import { slugify } from "../utils/slugify";

// STEP 12: Put the demo data in the database(part 1: shape the records)
// The data files use slugs and simple names; the database needs real ids,full photo addresses and every field the model expects. these functions do the translation.

// -----Star rating breakdown ----------------------
// The product page shows bars for 5,4,3,2,1 stars. when product.ts doesnt give ratingCounts, we make believable ones for the average rating.
// Each row: "if the rating is atleast minRating,split the reviews like this (percent)."

const RATING_SHARE = [
  { minRating: 4.7, shares: [80, 14, 4, 1, 1] },
  { minRating: 4.4, shares: [65, 22, 8, 3, 2] },
  { minRating: 4.7, shares: [50, 20, 12, 6, 4] },
  { minRating: 4.7, shares: [35, 30, 10, 10, 7] },
];

// making rateCounts(4.8, 248) -> [199, 35, 10,2,2] (ads up to exactly 248)
export const makeRatingCounts = (
  rating: number,
  reviewCount: number,
): number[] => {
  const { shares } = RATING_SHARE.find((row) => {
    return rating >= row.minRating;
  })!;

  const counts = shares.map((share) => {
    return Math.round((reviewCount * share) / 100);
  });

  //   Rounding can leave s 1 or 2 off,give the difference to the star bar
  const total = counts.reduce((sum, count) => {
    return sum + count;
  }, 0);

  counts[0] += reviewCount - total;

  return counts;
};

// ---PHOTOS ----
// From all photo ids on cloudinary, pick this products ones ("<slug>-1", "<slug>-2", ...)

// put them in number order and turn them into full addresses.

export const photosFor = (slug: string, photoIds: string[]): string[] => {
  const prefix = `${PHOTO_FOLDER}/${slug}-`;

  return photoIds
    .filter((id) => {
      return id.startsWith(prefix) && /^\d+$/.test(id.slice(prefix.length));
    })
    .sort((a, b) => {
      return Number(a.slice(prefix.length)) - Number(b.slice(prefix.length));
    })
    .map(photoUri);
};

// ---Categories -----
// categories.ts is already shaped like the category model, so we hand it over as it is.

export const demoCategories = () => {
  return categories;
};

// ------ Products --------------
// one product from product.ts -> one record shape like the product model.
// bundle and related are left out here: they point to other products, which don't have ids until they're saved, seed.ts link them afterwards ()

const buildProduct = (
  item: SeedProduct,
  categoryId: Types.ObjectId,
  photoIds: string[],
) => {
  const slug = slugify(item.name);

  return {
    name: item.name,
    slug,
    description: item.description,
    tagline: item.tagline,
    priceNote: item.priceNote,
    features: item.features ?? [],
    specs: item.specs ?? [],
    category: categoryId,
    brand: item.brand,
    sku: item.sku,
    price: item.price,
    oldPrice: item.oldPrice,
    costPrice: Math.round(item.price * 0.6), // pretend the shop paid 60% (admin margin display)
    trackStock: true,
    stock: item.stock,
    lowStockThreshold: 10,
    images: photosFor(item.photo ?? slug, photoIds),
    gallery: [], // empty = the product page uses images
    colors: item.colors ?? [],
    tags: item.tags ?? [],
    badge: item.badge,
    highlights: item.highlights ?? [],
    ratings: item.rating, // products.ts says "rating", the model says "ratings"
    reviewCount: item.reviewCount,
    ratingCounts:
      item.ratingCounts ?? makeRatingCounts(item.rating, item.reviewCount),
    sold: item.sold ?? item.reviewCount * 4,
    flashSaleStock: item.flashSaleStock,
    status: "published" as const,
  };
};

// All 40 products. categories maps a category slug to its saved_id'
// e.g "electronics" -> ObjectId("665f...")

export const demoProducts = (
  categoryIds: Map<string, Types.ObjectId>,
  photoIds: string[],
) => {
  return products.map((item) => {
    const categoryId = categoryIds.get(item.category);

    // A type in products.ts (e.g "electronics") should stop the seed loudly, not save bad data

    if (!categoryId) {
      throw new Error(
        `"${item.name}" has an unknown category: "${item.category}"`,
      );
    }

    return buildProduct(item, categoryId, photoIds);
  });
};
