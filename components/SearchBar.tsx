"use client";

import { useState, FormEvent } from "react";
import type { RoverFilter } from "@/lib/types";

interface SearchBarProps {
  onSearch: (params: { q: string; rover: RoverFilter }) => void;
  initialQ?: string;
  initialRover?: RoverFilter;
  disabled?: boolean;
}

const ROVER_OPTIONS: { value: RoverFilter; label: string }[] = [
  { value: "all", label: "All Rovers" },
  { value: "curiosity", label: "Curiosity" },
  { value: "perseverance", label: "Perseverance" },
];

export default function SearchBar({
  onSearch,
  initialQ = "",
  initialRover = "curiosity",
  disabled = false,
}: SearchBarProps) {
  const [q, setQ] = useState(initialQ);
  const [rover, setRover] = useState<RoverFilter>(initialRover);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const searchQuery = rover !== "all" ? `${rover} rover${q ? ` ${q}` : ""}` : q;
    onSearch({ q: searchQuery.trim(), rover });
  };

  const handleRoverChange = (value: RoverFilter) => {
    setRover(value);
    if (value !== "all") {
      setQ("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">
          Search NASA images
        </label>
        <input
          id="search-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={rover !== "all" ? `Search ${ROVER_OPTIONS.find((r) => r.value === rover)?.label} images…` : "Search all NASA images…"}
          disabled={!!disabled}
          className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="rover-filter" className="sr-only">
          Filter by rover
        </label>
        <select
          id="rover-filter"
          value={rover}
          onChange={(e) => handleRoverChange(e.target.value as RoverFilter)}
          disabled={!!disabled}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {ROVER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!!(disabled || !q.trim())}
        className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Search
      </button>
    </form>
  );
}