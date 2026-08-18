import { NextRequest, NextResponse } from "next/server";
import { getRoverOverview, toGalleryImage } from "@/lib/nasa-images";
import { ROVERS, type RoverName } from "@/lib/types";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const rover = (request.nextUrl.searchParams.get("rover") ?? "curiosity") as RoverName;
  if (!ROVERS.includes(rover)) {
    return NextResponse.json(
      { error: `Unknown rover: ${rover}` },
      { status: 400 },
    );
  }

  try {
    const overview = await getRoverOverview(rover);
    const items = overview.items.flatMap((item) => {
      const normalized = toGalleryImage(item);
      return normalized ? [normalized] : [];
    });

    return NextResponse.json({
      rover: overview.rover,
      totalImages: overview.totalImages,
      items,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load rover overview" },
      { status: 502 },
    );
  }
}
