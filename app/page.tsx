import SearchTabs from "@/components/SearchTabs";
import SearchView from "@/components/SearchView";

export default function Home() {
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

      <SearchTabs searchContent={<SearchView />} />
    </main>
  );
}
