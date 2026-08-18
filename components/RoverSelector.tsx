"use client";

import { ROVERS, type RoverName } from "@/lib/types";

interface RoverSelectorProps {
  value: RoverName;
  onChange: (rover: RoverName) => void;
  disabled?: boolean;
}

const LABELS: Record<RoverName, string> = {
  curiosity: "Curiosity",
  perseverance: "Perseverance",
};

export default function RoverSelector({
  value,
  onChange,
  disabled,
}: RoverSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="rover-select"
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Rover
      </label>
      <select
        id="rover-select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as RoverName)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {ROVERS.map((rover) => (
          <option key={rover} value={rover}>
            {LABELS[rover]}
          </option>
        ))}
      </select>
    </div>
  );
}
