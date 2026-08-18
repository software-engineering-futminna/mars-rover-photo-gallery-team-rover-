export type RoverName = "curiosity" | "perseverance";

export const ROVERS: RoverName[] = ["curiosity", "perseverance"];

export type RoverFilter = "all" | "curiosity" | "perseverance";

export const ROVER_FILTERS: RoverFilter[] = ["all", "curiosity", "perseverance"];

export interface Camera {
  name: string;
  full_name: string;
}

export interface Manifest {
  rover: RoverName;
  cameras: Camera[];
  maxSol: number;
  maxDate: string;
  totalPhotos: number;
  status: string;
  landingDate: string;
  launchDate: string;
}

export type MediaType = "image" | "video" | "audio";

export interface SearchParams {
  q: string;
  media_type?: MediaType;
  year_start?: string;
  year_end?: string;
  center?: string;
  page?: number;
  page_size?: number;
}

export interface NasaImageData {
  nasa_id: string;
  title: string;
  description?: string;
  date_created: string;
  center?: string;
  photographer?: string;
  keywords?: string[];
  media_type: MediaType;
  description_508?: string;
  secondary_creator?: string;
  location?: string;
  album?: string[];
}

export interface NasaImageLink {
  href: string;
  rel: "preview" | "captions" | string;
  render?: "image" | "video";
  prompt?: string;
}

export interface NasaImageItem {
  data: NasaImageData[];
  links?: NasaImageLink[];
}

export interface NasaSearchResponse {
  collection: {
    version: "1.0";
    href: string;
    items: NasaImageItem[];
    metadata: {
      total_hits: number;
    };
    links?: Array<{
      rel: "next" | "prev" | string;
      href: string;
    }>;
  };
}

export interface NasaAssetItem {
  href: string;
}

export interface NasaAssetResponse {
  collection: {
    version: string;
    href: string;
    items: NasaAssetItem[];
  };
}

export interface NasaImageDetail {
  data: NasaImageData;
  thumbnail: string | null;
  assetUrls: Record<string, string>;
}

export interface RoverOverviewImage {
  nasa_id: string;
  title: string;
  date_created: string;
  center?: string;
  thumbnail: string | null;
}

export interface RoverOverviewResponse {
  rover: RoverName;
  totalImages: number;
  items: RoverOverviewImage[];
}