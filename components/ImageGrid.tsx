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
      <div className="text-center py-12 text-red-600 dark:text-red-400">
        <p>Error loading images: {error}</p>
      </div>
    );
  }

  if (loading && images.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-lg bg-zinc-200 animate-pulse dark:bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        <p>No images found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((data) => {
        if (!data?.nasa_id || !data.title) return null;
        const thumbnail = data.thumbnail;
        
        return (
          <Link
            key={data.nasa_id}
            href={`/image/${data.nasa_id}`}
            className="group block rounded-lg overflow-hidden border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={data.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-600">
                  No preview
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {data.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
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
