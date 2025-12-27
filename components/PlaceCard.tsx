import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/lib/sheets';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  // Parse regions (comma-separated)
  const regions = place.region 
    ? place.region.split(',').map(r => r.trim()) 
    : [];

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
        {regions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {regions.map((region) => (
              <span 
                key={region} 
                className="text-xs uppercase tracking-wide text-foreground/50"
              >
                {region}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-olive transition-colors">
          {place.title}
        </h3>
        {place.subtitle && (
          <p className="text-sm text-foreground/60 line-clamp-2">
            {place.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
