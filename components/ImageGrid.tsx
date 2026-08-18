"use client";

import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "@/lib/types";

interface ImageGridProps {
  images: GalleryImage[];
  loading?: boolean;
  error?: string | null;
}

export default function ImageGrid({ images, loading, error }: ImageGridProps) {
  if (error) {
    return (
      <div className="py-12 text-center text-sm text-red-600 dark:text-red-400">
        <p>Error loading images: {error}</p>
      </div>
    );
  }

  if (loading && images.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
        <p>No images found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((data) => {
        if (!data?.nasa_id || !data.title) return null;
        const thumbnail = data.thumbnail;

        return (
          <Link
            key={data.nasa_id}
            href={`/image/${data.nasa_id}`}
            className="group block overflow-hidden transition-opacity hover:opacity-70"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={data.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-600">
                  No preview
                </div>
              )}
            </div>
            <div className="px-0.5 py-2">
              <h3 className="text-sm font-normal text-zinc-900 line-clamp-2 dark:text-zinc-100">
                {data.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                <time dateTime={data.date_created}>
                  {new Date(data.date_created).toLocaleDateString()}
                </time>
                {data.center && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{data.center}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
