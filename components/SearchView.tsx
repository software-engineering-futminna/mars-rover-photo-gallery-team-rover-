"use client";

import { useState, useCallback, useEffect } from "react";
import SearchBar from "./SearchBar";
import ImageGrid from "./ImageGrid";
import type { GalleryImage, RoverFilter } from "@/lib/types";

interface SearchResult {
  items: GalleryImage[];
  totalHits: number;
  currentPage: number;
  pageSize: number;
  nextPage: number | null;
}

export default function SearchView() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({ q: "", rover: "curiosity" as RoverFilter });

  const fetchImages = useCallback(async (params: { q: string; rover: RoverFilter; page?: number }) => {
    setLoading(true);
    setError(null);
    
    const page = params.page ?? 1;
    const searchUrl = new URL("/api/search", window.location.origin);
    searchUrl.searchParams.set("q", params.q);
    searchUrl.searchParams.set("rover", params.rover);
    searchUrl.searchParams.set("page", page.toString());
    searchUrl.searchParams.set("page_size", "20");
    searchUrl.searchParams.set("media_type", "image");

    try {
      const res = await fetch(searchUrl.toString());
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search images");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((params: { q: string; rover: RoverFilter }) => {
    setSearchParams(params);
    fetchImages({ ...params, page: 1 });
  }, [fetchImages]);

  const handlePageChange = useCallback((page: number) => {
    fetchImages({ ...searchParams, page });
  }, [fetchImages, searchParams]);

  // Dump whatever on first load so the gallery shows something before any search.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchImages({ q: "", rover: "curiosity", page: 1 });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        initialQ={searchParams.q}
        initialRover={searchParams.rover}
        disabled={!!loading}
      />

      <ImageGrid
        images={results?.items ?? []}
        loading={loading}
        error={error}
      />

      {results && results.totalHits > 0 && (
        <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {results.items.length} of {results.totalHits.toLocaleString()}
          </p>

          <div className="flex items-center gap-4">
            {results.currentPage > 1 && (
              <button
                onClick={() => handlePageChange(results.currentPage - 1)}
                disabled={!!loading}
                className="text-sm text-zinc-500 transition-opacity hover:opacity-60 disabled:opacity-30 dark:text-zinc-400"
              >
                Previous
              </button>
            )}

            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {results.currentPage}
            </span>

            {results.nextPage && (
              <button
                onClick={() => handlePageChange(results.nextPage!)}
                disabled={!!loading}
                className="text-sm text-zinc-500 transition-opacity hover:opacity-60 disabled:opacity-30 dark:text-zinc-400"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
