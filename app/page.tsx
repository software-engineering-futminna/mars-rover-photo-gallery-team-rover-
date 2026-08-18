"use client";

import { useEffect, useState } from "react";
import RoverSelector from "@/components/RoverSelector";
import SearchTabs from "@/components/SearchTabs";
import SearchView from "@/components/SearchView";
import ImageGrid from "@/components/ImageGrid";
import type { RoverName, RoverOverviewResponse, NasaImageItem } from "@/lib/types";

const ROVER_LABELS: Record<RoverName, string> = {
  curiosity: "Curiosity",
  perseverance: "Perseverance",
};

export default function Home() {
  const [rover, setRover] = useState<RoverName>("curiosity");
  const [overview, setOverview] = useState<RoverOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/manifest?rover=${rover}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: RoverOverviewResponse) => setOverview(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Could not load rover information.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [rover]);

  const handleRoverChange = (next: RoverName) => {
    setRover(next);
    setLoading(true);
    setError(null);
  };

  const overviewItems: NasaImageItem[] = overview
    ? overview.items.map((img) => ({
        data: [
          {
            nasa_id: img.nasa_id,
            title: img.title,
            date_created: img.date_created,
            center: img.center,
            media_type: "image",
          },
        ],
        links: img.thumbnail ? [{ href: img.thumbnail, rel: "preview", render: "image" }] : undefined,
      }))
    : [];

  const manifestContent = (
    <>
      <section className="mb-6 flex flex-wrap items-end gap-4">
        <RoverSelector
          value={rover}
          onChange={handleRoverChange}
          disabled={!!loading}
        />
      </section>

      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {loading && <p className="text-zinc-500">Loading rover data…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {overview && !loading && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            <div>
              <dt className="font-medium text-zinc-500">Rover</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {ROVER_LABELS[overview.rover]}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Total images</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {overview.totalImages.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Source</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">NASA Image Library</dd>
            </div>
          </dl>
        )}
      </section>

      {overview && !loading && (
        <>
          <h2 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Recent images
          </h2>
          <ImageGrid images={overviewItems} loading={loading} error={error} />
        </>
      )}
    </>
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Mars Rover Photo Gallery
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Browse photographs captured by NASA&rsquo;s Mars rovers.
        </p>
      </header>

      <SearchTabs
        manifestContent={manifestContent}
        searchContent={<SearchView />}
      />
    </main>
  );
}