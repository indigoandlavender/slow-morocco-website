import Link from 'next/link';
import Image from 'next/image';
import { Destination } from '@/lib/sheets';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/destination/${destination.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-foreground/5">
        {destination.heroImage ? (
          <Image
            src={destination.heroImage}
            alt={destination.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-sand" />
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-olive transition-colors">
          {destination.title}
        </h3>
        {destination.subtitle && (
          <p className="text-sm text-foreground/60 line-clamp-2">
            {destination.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
