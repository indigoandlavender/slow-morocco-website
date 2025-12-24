"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface Journey {
  slug: string;
  title: string;
  duration: string;
  durationDays: number;
  description: string;
  arcDescription: string;
  heroImage: string;
  startCity: string;
  focus: string;
  journeyId: string;
}

interface ItineraryDay {
  dayNumber: number;
  cityName: string;
  fromCity: string;
  toCity: string;
  description: string;
  imageUrl: string;
  travelTime: string;
  difficulty: string;
  activities: string;
  meals: string;
  routeType: string;
}

// Journeys Carousel Component
function JourneysCarousel({ currentSlug }: { currentSlug: string }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        // Filter out current journey
        const otherJourneys = (data.journeys || []).filter(
          (j: Journey) => j.slug !== currentSlug
        );
        setJourneys(otherJourneys);
      })
      .catch(console.error);
  }, [currentSlug]);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    
    const cardWidth = 280 + 24; // card width + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  if (journeys.length === 0) return null;

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : true;

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center transition-opacity ${
          canScrollLeft ? "opacity-100 hover:bg-muted" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {journeys.map((journey) => (
          <Link
            key={journey.slug}
            href={`/journeys/${journey.slug}`}
            className="flex-shrink-0 w-[280px] group"
          >
            <div className="relative aspect-[4/5] mb-3 overflow-hidden bg-[#e8e0d4]">
              {journey.heroImage && (
                <Image
                  src={journey.heroImage}
                  alt={journey.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <h3 className="font-serif text-lg mb-1">{journey.title}</h3>
            <p className="text-xs text-muted-foreground tracking-wide">
              {journey.durationDays} Days
            </p>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center transition-opacity ${
          canScrollRight ? "opacity-100 hover:bg-muted" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function JourneyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/journeys/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setJourney(data.journey);
          setItinerary(data.itinerary || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl mb-4">Journey not found</h1>
        <Link href="/journeys" className="text-sm underline">
          Back to all journeys
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#e8e0d4]">
        {journey.heroImage && (
          <Image
            src={journey.heroImage}
            alt={journey.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {/* Back Link */}
          <Link
            href="/journeys"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Journeys
          </Link>

          {/* Duration */}
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {journey.durationDays} Days
          </p>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {journey.title}
          </h1>

          {/* Arc Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16 font-display italic">
            {journey.arcDescription || journey.description}
          </p>

          {/* Itinerary */}
          <div className="space-y-20">
            {itinerary
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((day) => (
                <div key={day.dayNumber}>
                  {/* Day Image - Vertical, left-aligned, wider */}
                  {day.imageUrl && (
                    <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden mb-8">
                      <Image
                        src={day.imageUrl}
                        alt={`Day ${day.dayNumber} - ${day.cityName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Day Label */}
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Day {day.dayNumber}
                  </p>

                  {/* Day Title */}
                  <h2 className="font-serif text-2xl md:text-3xl mb-4">
                    {day.fromCity && day.toCity && day.fromCity !== day.toCity 
                      ? `${day.fromCity} → ${day.toCity}`
                      : day.cityName
                    }
                  </h2>

                  {/* Day Metadata */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 text-sm text-muted-foreground">
                    {/* Travel Time */}
                    {day.travelTime && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7V12L15 14" />
                        </svg>
                        <span>{day.travelTime}h drive</span>
                      </div>
                    )}
                    
                    {/* Activities */}
                    {day.activities && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <span>{day.activities.replace(/_/g, " ").toLowerCase()}</span>
                      </div>
                    )}
                    
                    {/* Meals */}
                    {day.meals && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                          <line x1="6" y1="1" x2="6" y2="4" />
                          <line x1="10" y1="1" x2="10" y2="4" />
                          <line x1="14" y1="1" x2="14" y2="4" />
                        </svg>
                        <span>{day.meals}</span>
                      </div>
                    )}
                  </div>

                  {/* Day Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {day.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* More Journeys Carousel */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <JourneysCarousel currentSlug={slug} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            This journey is a starting point.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            These itineraries aren't fixed. They're designed to bend. Add a day in the desert. Skip the city. Stay longer where something pulls you. This is your journey—we shape it around what matters to you.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Start The Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
