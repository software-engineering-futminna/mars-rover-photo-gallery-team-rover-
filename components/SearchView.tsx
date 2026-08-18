"use client";

import { useState, useCallback, FormEvent } from "react";
import SearchBar from "./SearchBar";
import ImageGrid from "./ImageGrid";
import type { NasaImageItem, RoverFilter } from "@/lib/types";

interface SearchResult {
  items: NasaImageItem[];
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

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        initialQ={searchParams.q}
        initialRover={searchParams.rover}
        disabled={loading}
      />

      <ImageGrid
        images={results?.items ?? []}
        loading={loading}
        error={error}
      />

      {results && results.totalHits > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {results.items.length} of {results.totalHits.toLocaleString()} results
          </p>
          
          <div className="flex items-center gap-2">
            {results.currentPage > 1 && (
              <button
                onClick={() => handlePageChange(results.currentPage - 1)}
                disabled={loading}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
            )}
            
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {results.currentPage}
            </span>
            
            {results.nextPage && (
              <button
                onClick={() => handlePageChange(results.nextPage!)}
                disabled={loading}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
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