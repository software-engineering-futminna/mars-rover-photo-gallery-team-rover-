import { NextRequest, NextResponse } from "next/server";
import { searchImages, buildRoverQuery, toGalleryImage } from "@/lib/nasa-images";
import type { SearchParams, RoverFilter } from "@/lib/types";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const rover = (searchParams.get("rover") as RoverFilter) ?? "curiosity";
  const userQuery = searchParams.get("q") ?? "";
  const q = buildRoverQuery(rover, userQuery);
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
    const response = await searchImages(params);
    
    const items = response.collection.items.flatMap((item) => {
      const normalized = toGalleryImage(item);
      return normalized ? [normalized] : [];
    });

    const nextLink = response.collection.links?.find((l) => l.rel === "next");
    const nextPage = nextLink ? page + 1 : null;

    return NextResponse.json({
      items,
      totalHits: response.collection.metadata.total_hits,
      currentPage: page,
      pageSize: page_size,
      nextPage,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to search NASA images" },
      { status: 502 },
    );
  }
}
