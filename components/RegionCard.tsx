import Link from 'next/link';
import Image from 'next/image';
import { Region } from '@/lib/sheets';

interface RegionCardProps {
  region: Region;
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <Link href={`/places/${region.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-foreground/5">
        {region.heroImage ? (
          <Image
            src={region.heroImage}
            alt={region.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-sand" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        {/* Title on image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
            {region.title}
          </h2>
          {region.subtitle && (
            <p className="text-white/80 text-sm">
              {region.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
