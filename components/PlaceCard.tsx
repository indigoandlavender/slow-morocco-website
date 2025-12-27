import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/lib/sheets';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/place/${place.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-foreground/5">
        {place.heroImage ? (
          <Image
            src={place.heroImage}
            alt={place.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-sand" />
        )}
      </div>

      {/* Content */}
      <div>
        {place.category && (
          <span className="text-xs uppercase tracking-wide text-foreground/50 mb-2 block">
            {place.category}
          </span>
        )}
        <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-olive transition-colors">
          {place.title}
        </h3>
        {place.excerpt && (
          <p className="text-sm text-foreground/60 line-clamp-2">
            {place.excerpt}
          </p>
        )}
        {/* Practical info preview */}
        {(place.fees || place.opening_hours) && (
          <div className="mt-3 text-xs text-foreground/50 space-y-1">
            {place.fees && <p>{place.fees}</p>}
            {place.opening_hours && <p>{place.opening_hours}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}
