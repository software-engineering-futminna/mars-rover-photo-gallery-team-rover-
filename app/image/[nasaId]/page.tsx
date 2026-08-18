import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageDetail } from "@/lib/nasa-images";

export const revalidate = 3600;

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ nasaId: string }>;
}) {
  const { nasaId } = await params;

  let detail;
  try {
    detail = await getImageDetail(nasaId);
  } catch {
    notFound();
  }

  const { data, thumbnail, assetUrls } = detail;

  if (!data) {
    notFound();
  }

  const displayImage = assetUrls.orig ?? assetUrls.large ?? assetUrls.medium ?? thumbnail ?? null;

  const sizeOrder: Array<"orig" | "large" | "medium" | "small" | "thumb"> = [
    "orig",
    "large",
    "medium",
    "small",
    "thumb",
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        &larr; Back to gallery
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={data.title}
                width={1200}
                height={900}
                className="h-auto w-full object-contain"
                priority
                unoptimized
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-zinc-400 dark:text-zinc-600">
                Image unavailable
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {data.title}
          </h1>

          {data.date_created && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {new Date(data.date_created).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {data.description && (
            <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {data.description}
            </p>
          )}

          <dl className="mt-6 space-y-3 text-sm">
            {data.center && (
              <div>
                <dt className="font-medium text-zinc-500">Center</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">{data.center}</dd>
              </div>
            )}
            {data.photographer && (
              <div>
                <dt className="font-medium text-zinc-500">Photographer</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">{data.photographer}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-zinc-500">NASA ID</dt>
              <dd className="break-all font-mono text-xs text-zinc-900 dark:text-zinc-100">
                {data.nasa_id}
              </dd>
            </div>
          </dl>

          {data.keywords && data.keywords.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-zinc-500">Keywords</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(assetUrls).length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-zinc-500">Download</h2>
              <div className="mt-2 flex flex-col gap-2">
                {sizeOrder
                  .filter((size) => assetUrls[size])
                  .map((size) => (
                    <a
                      key={size}
                      href={assetUrls[size]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)} ({size})
                    </a>
                  ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}