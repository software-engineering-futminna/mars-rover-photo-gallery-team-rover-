import SearchTabs from "@/components/SearchTabs";
import SearchView from "@/components/SearchView";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-10 flex items-center justify-between gap-4">
        <h1 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
          Mars Rover
        </h1>
        <ThemeToggle />
      </header>

      <SearchTabs searchContent={<SearchView />} />
    </main>
  );
}
