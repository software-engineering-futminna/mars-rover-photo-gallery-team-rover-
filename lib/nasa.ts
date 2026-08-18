import type { Camera, Manifest, RoverName } from "./types";

const API_KEY = process.env.NASA_API_KEY ?? "DEMO_KEY";
const BASE = "https://api.nasa.gov/mars-photos/api/v1";

interface RawManifest {
  photo_manifest: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    cameras: Camera[];
  };
}

export async function getManifest(rover: RoverName): Promise<Manifest> {
  const res = await fetch(`${BASE}/manifests/${rover}?api_key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`NASA manifest request failed: ${res.status}`);
  }
  const data = (await res.json()) as RawManifest;
  const m = data.photo_manifest;
  return {
    rover,
    cameras: m.cameras,
    maxSol: m.max_sol,
    maxDate: m.max_date,
    totalPhotos: m.total_photos,
    status: m.status,
    landingDate: m.landing_date,
    launchDate: m.launch_date,
  };
}
