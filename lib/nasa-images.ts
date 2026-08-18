import type {
  SearchParams,
  NasaSearchResponse,
  NasaAssetResponse,
  RoverFilter,
  RoverName,
  NasaImageData,
  NasaImageItem,
} from "./types";

const BASE = "https://images-api.nasa.gov";

const ROVER_PREFIX: Record<RoverFilter, string> = {
  all: "",
  curiosity: "curiosity rover",
  perseverance: "perseverance rover",
};

export function buildRoverQuery(rover: RoverFilter, userQuery: string): string {
  const prefix = ROVER_PREFIX[rover];
  if (!prefix) return userQuery.trim();
  if (!userQuery.trim()) return prefix;
  return `${prefix} ${userQuery.trim()}`;
}

function buildSearchUrl(params: SearchParams): string {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set("q", params.q);
  if (params.media_type) url.searchParams.set("media_type", params.media_type);
  if (params.year_start) url.searchParams.set("year_start", params.year_start);
  if (params.year_end) url.searchParams.set("year_end", params.year_end);
  if (params.center) url.searchParams.set("center", params.center);
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.page_size) url.searchParams.set("page_size", params.page_size.toString());
  return url.toString();
}

export async function searchImages(params: SearchParams): Promise<NasaSearchResponse> {
  const url = buildSearchUrl(params);
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`NASA image search failed: ${res.status}`);
  }

  return (await res.json()) as NasaSearchResponse;
}

export async function getAsset(nasaId: string): Promise<NasaAssetResponse> {
  const url = `${BASE}/asset/${nasaId}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`NASA asset request failed: ${res.status}`);
  }

  return (await res.json()) as NasaAssetResponse;
}

export async function getMetadata(nasaId: string): Promise<{ collection: { items: { href: string }[] } }> {
  const url = `${BASE}/metadata/${nasaId}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`NASA metadata request failed: ${res.status}`);
  }

  return (await res.json()) as { collection: { items: { href: string }[] } };
}

const SIZE_SUFFIXES = ["orig", "large", "medium", "small", "thumb"] as const;
type ImageSize = (typeof SIZE_SUFFIXES)[number];

export function getAssetUrlsBySize(assetResponse: NasaAssetResponse): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const item of assetResponse.collection.items) {
    for (const size of SIZE_SUFFIXES) {
      if (item.href.includes(`~${size}`)) {
        urls[size] = item.href;
        break;
      }
    }
  }
  return urls;
}

export function getBestImageUrl(assetResponse: NasaAssetResponse, preference: ImageSize = "orig"): string | null {
  const urls = getAssetUrlsBySize(assetResponse);
  const order: ImageSize[] =
    preference === "orig" ? ["orig", "large", "medium", "small", "thumb"] :
    preference === "large" ? ["large", "orig", "medium", "small", "thumb"] :
    ["medium", "large", "orig", "small", "thumb"];

  for (const size of order) {
    if (urls[size]) return urls[size];
  }
  return assetResponse.collection.items[0]?.href ?? null;
}

export function getThumbnailUrl(imageItem: NasaImageItem): string | null {
  const previewLink = imageItem.links?.find((l) => l.rel === "preview" && l.render === "image");
  return previewLink?.href ?? null;
}

export function getImageData(imageItem: NasaImageItem): NasaImageData | null {
  return imageItem.data[0] ?? null;
}

export interface RoverOverview {
  rover: RoverName;
  totalImages: number;
  items: NasaImageItem[];
}

/**
 * Aggregate rover info from the NASA Image and Video Library API.
 * The legacy Mars Photos manifest API was archived by NASA, so we derive
 * an overview (total image count + recent images) from image search instead.
 */
export async function getRoverOverview(rover: RoverName): Promise<RoverOverview> {
  const q = buildRoverQuery(rover, "");
  const res = await searchImages({ q, media_type: "image", page_size: 8 });
  return {
    rover,
    totalImages: res.collection.metadata.total_hits,
    items: res.collection.items,
  };
}

/**
 * Fetch full detail for a single image by its NASA ID:
 * descriptive metadata (via search) + available asset size URLs.
 */
export async function getImageDetail(nasaId: string): Promise<{
  data: NasaImageData | null;
  thumbnail: string | null;
  assetUrls: Record<string, string>;
}> {
  const [searchRes, assetRes] = await Promise.all([
    searchImages({ q: nasaId, media_type: "image", page_size: 1 }),
    getAsset(nasaId),
  ]);

  const item = searchRes.collection.items.find(
    (i) => i.data[0]?.nasa_id === nasaId,
  ) ?? searchRes.collection.items[0];

  const data = item?.data[0] ?? null;
  const thumbnail = item ? getThumbnailUrl(item) : null;
  const assetUrls = getAssetUrlsBySize(assetRes);

  return { data, thumbnail, assetUrls };
}