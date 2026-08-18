import { NextRequest, NextResponse } from "next/server";
import { getManifest } from "@/lib/nasa";
import { ROVERS, type RoverName } from "@/lib/types";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const rover = request.nextUrl.searchParams.get("rover") ?? "curiosity";
  if (!ROVERS.includes(rover as RoverName)) {
    return NextResponse.json(
      { error: `Unknown rover: ${rover}` },
      { status: 400 },
    );
  }

  try {
    const manifest = await getManifest(rover as RoverName);
    return NextResponse.json(manifest);
  } catch {
    return NextResponse.json(
      { error: "Failed to load rover manifest" },
      { status: 502 },
    );
  }
}
