import { NextRequest, NextResponse } from "next/server";
import { getRoverOverview } from "@/lib/nasa-images";
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
    const items = overview.items.map((item) => {
      const data = item.data[0];
      const thumbnail = item.links?.find((l) => l.rel === "preview" && l.render === "image")?.href ?? null;
      return {
        nasa_id: data.nasa_id,
        title: data.title,
        date_created: data.date_created,
        center: data.center,
        thumbnail,
      };
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