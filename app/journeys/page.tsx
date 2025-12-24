"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [durationFilter, setDurationFilter] = useState("all");
  const [startCityFilter, setStartCityFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        setJourneys(data.journeys || []);
        setFilteredJourneys(data.journeys || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...journeys];

    // Duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter((j) => {
        const days = j.durationDays || 0;
        if (durationFilter === "1-5") return days >= 1 && days <= 5;
        if (durationFilter === "6-10") return days >= 6 && days <= 10;
        if (durationFilter === "11+") return days >= 11;
        return true;
      });
    }

    // Start city filter
    if (startCityFilter !== "all") {
      filtered = filtered.filter((j) => 
        j.startCity?.toLowerCase() === startCityFilter.toLowerCase()
      );
    }

    // Focus filter
    if (focusFilter !== "all") {
      filtered = filtered.filter((j) => 
        j.focus?.toLowerCase().includes(focusFilter.toLowerCase())
      );
    }

    setFilteredJourneys(filtered);
  }, [journeys, durationFilter, startCityFilter, focusFilter]);

  const FilterButton = ({ 
    active, 
    onClick, 
    children 
  }: { 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`text-xs tracking-[0.1em] uppercase pb-2 transition-colors ${
        active 
          ? "text-foreground border-b-2 border-foreground" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-muted">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light">
            J O U R N E Y S
          </h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {/* Duration Filter */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Duration
              </p>
              <div className="flex flex-wrap gap-4">
                <FilterButton 
                  active={durationFilter === "all"} 
                  onClick={() => setDurationFilter("all")}
                >
                  All
                </FilterButton>
                <FilterButton 
                  active={durationFilter === "1-5"} 
                  onClick={() => setDurationFilter("1-5")}
                >
                  1-5 Days
                </FilterButton>
                <FilterButton 
                  active={durationFilter === "6-10"} 
                  onClick={() => setDurationFilter("6-10")}
                >
                  6-10 Days
                </FilterButton>
                <FilterButton 
                  active={durationFilter === "11+"} 
                  onClick={() => setDurationFilter("11+")}
                >
                  11+ Days
                </FilterButton>
              </div>
            </div>

            {/* Start City Filter */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Start City
              </p>
              <div className="flex flex-wrap gap-4">
                <FilterButton 
                  active={startCityFilter === "all"} 
                  onClick={() => setStartCityFilter("all")}
                >
                  All
                </FilterButton>
                <FilterButton 
                  active={startCityFilter === "casablanca"} 
                  onClick={() => setStartCityFilter("casablanca")}
                >
                  Casablanca
                </FilterButton>
                <FilterButton 
                  active={startCityFilter === "marrakech"} 
                  onClick={() => setStartCityFilter("marrakech")}
                >
                  Marrakech
                </FilterButton>
                <FilterButton 
                  active={startCityFilter === "fes"} 
                  onClick={() => setStartCityFilter("fes")}
                >
                  Fes
                </FilterButton>
                <FilterButton 
                  active={startCityFilter === "tangier"} 
                  onClick={() => setStartCityFilter("tangier")}
                >
                  Tangier
                </FilterButton>
              </div>
            </div>

            {/* Focus Filter */}
            <div className="md:col-span-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Focus
              </p>
              <div className="flex flex-wrap gap-4">
                <FilterButton 
                  active={focusFilter === "all"} 
                  onClick={() => setFocusFilter("all")}
                >
                  All
                </FilterButton>
                <FilterButton 
                  active={focusFilter === "desert"} 
                  onClick={() => setFocusFilter("desert")}
                >
                  Desert
                </FilterButton>
                <FilterButton 
                  active={focusFilter === "mountains"} 
                  onClick={() => setFocusFilter("mountains")}
                >
                  Mountains
                </FilterButton>
                <FilterButton 
                  active={focusFilter === "culture"} 
                  onClick={() => setFocusFilter("culture")}
                >
                  Culture
                </FilterButton>
                <FilterButton 
                  active={focusFilter === "coast"} 
                  onClick={() => setFocusFilter("coast")}
                >
                  Coast
                </FilterButton>
                <FilterButton 
                  active={focusFilter === "food"} 
                  onClick={() => setFocusFilter("food")}
                >
                  Food
                </FilterButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journeys Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : filteredJourneys.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">No journeys match your filters.</p>
              <button
                onClick={() => {
                  setDurationFilter("all");
                  setStartCityFilter("all");
                  setFocusFilter("all");
                }}
                className="text-sm underline hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredJourneys.map((journey: any) => (
                <Link
                  key={journey.slug}
                  href={`/journeys/${journey.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-[#e8e0d4]">
                    {journey.heroImage && (
                      <Image
                        src={journey.heroImage}
                        alt={journey.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    {/* Category Badge */}
                    {journey.category && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] tracking-[0.1em] uppercase bg-background/90 px-3 py-1.5">
                          {journey.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-xl mb-2">
                    {journey.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {journey.durationDays} days
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {journey.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
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
