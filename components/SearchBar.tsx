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
    <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
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
          className="w-full bg-transparent px-0 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:text-zinc-100 dark:placeholder:text-zinc-500"
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
          className="cursor-pointer bg-transparent py-2 text-sm text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:text-zinc-400"
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
        className="whitespace-nowrap py-2 text-sm font-medium text-zinc-900 transition-opacity hover:opacity-60 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed dark:text-zinc-100"
      >
        Search
      </button>
    </form>
  );
}
