import { NextRequest, NextResponse } from "next/server";
import { searchImages, buildRoverQuery, type SearchParams } from "@/lib/nasa";
import type { RoverFilter } from "@/lib/types";

export const revalidate = 3600;

const ROVER_QUERIES: Record<RoverFilter, string> = {
  all: "",
  curiosity: "curiosity rover",
  perseverance: "perseverance rover",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const rover = (searchParams.get("rover") as RoverFilter) ?? "curiosity";
  const q = searchParams.get("q") ?? ROVER_QUERIES[rover] ?? "curiosity rover";
  const media_type = searchParams.get("media_type") as SearchParams["media_type"];
  const year_start = searchParams.get("year_start") ?? undefined;
  const year_end = searchParams.get("year_end") ?? undefined;
  const center = searchParams.get("center") ?? undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const page_size = searchParams.get("page_size") ? parseInt(searchParams.get("page_size")!, 10) : 20;

  const params: SearchParams = {
    q,
    media_type,
    year_start,
    year_end,
    center,
    page,
    page_size,
  };

  try {
    const collection = await searchImages(params);
    return NextResponse.json(collection);
  } catch {
    return NextResponse.json(
      { error: "Failed to search NASA images" },
      { status: 502 },
    );
  }
}