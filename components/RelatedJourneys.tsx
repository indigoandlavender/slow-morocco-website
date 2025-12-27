"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Journey {
  slug: string;
  title: string;
  duration: string;
  description: string;
  heroImage: string;
  destinations: string;
}

interface RelatedJourneysProps {
  destination: string;
  currentPlaceTitle?: string;
}

export default function RelatedJourneys({ destination, currentPlaceTitle }: RelatedJourneysProps) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJourneys() {
      try {
        const res = await fetch("/api/journeys");
        if (!res.ok) return;
        
        const data = await res.json();
        const allJourneys = data.journeys || [];
        
        // Filter journeys that include this destination
        const related = allJourneys.filter((journey: Journey) => {
          if (!journey.destinations) return false;
          const dests = journey.destinations.split(",").map((d: string) => d.trim().toLowerCase());
          return dests.includes(destination.toLowerCase());
        });
        
        // Max 2 journeys
        setJourneys(related.slice(0, 2));
      } catch (error) {
        console.error("Error fetching journeys:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJourneys();
  }, [destination]);

  // Don't render anything if no related journeys or still loading
  if (loading || journeys.length === 0) {
    return null;
  }

  return (
    <section 
      className="mt-24 pt-12 border-t border-foreground/10"
      aria-label={`Journeys visiting ${currentPlaceTitle || "this place"}`}
    >
      <h2 className="font-display text-xl text-foreground/60 mb-10">
        Related Journeys
      </h2>
      
      <div className={`grid gap-8 ${journeys.length === 1 ? "max-w-md" : "md:grid-cols-2"}`}>
        {journeys.map((journey) => (
          <Link
            key={journey.slug}
            href={`/journeys/${journey.slug}`}
            className="group block"
          >
            <article>
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-foreground/5 mb-4">
                {journey.heroImage ? (
                  <Image
                    src={journey.heroImage}
                    alt={journey.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-foreground/5" />
                )}
              </div>
              
              {/* Content */}
              <div className="space-y-1">
                <h3 className="font-display text-lg group-hover:underline underline-offset-4 decoration-foreground/30">
                  {journey.title}
                </h3>
                
                {journey.description && (
                  <p className="text-foreground/60 text-sm line-clamp-2">
                    {journey.description}
                  </p>
                )}
                
                {journey.duration && (
                  <p className="text-foreground/40 text-sm">
                    {journey.duration}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
