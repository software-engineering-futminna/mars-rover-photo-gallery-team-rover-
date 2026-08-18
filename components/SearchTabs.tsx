"use client";

import { useState } from "react";

type Tab = "manifest" | "search";

interface SearchTabsProps {
  manifestContent: React.ReactNode;
  searchContent: React.ReactNode;
}

export default function SearchTabs({ manifestContent, searchContent }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("manifest");

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("manifest")}
            className={`flex -mb-px px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "manifest"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            aria-current={activeTab === "manifest" ? "page" : undefined}
          >
            Rover Manifest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex -mb-px px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            aria-current={activeTab === "search" ? "page" : undefined}
          >
            Search Images
          </button>
        </nav>
      </div>

      <div role="tabpanel" aria-labelledby="manifest-tab">
        {activeTab === "manifest" && manifestContent}
        {activeTab === "search" && searchContent}
      </div>
    </div>
  );
}