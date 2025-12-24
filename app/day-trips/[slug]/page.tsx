"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, MapPin, Mountain } from "lucide-react";
import DayTripBookingModal from "@/components/DayTripBookingModal";

interface DayTrip {
  slug: string;
  routeId: string;
  title: string;
  shortDescription: string;
  durationHours: number;
  priceMAD: number;
  priceEUR: number;
  departureCity: string;
  category: string;
  heroImage: string;
  includes: string[];
  excludes: string[];
  meetingPoint: string;
  narrative: string;
  fromCity: string;
  toCity: string;
  viaCities: string;
  travelTime: string;
  activities: string;
  difficulty: string;
  region: string;
  routeImage: string;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  priceMAD: number;
  priceEUR: number;
}

export default function DayTripDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [dayTrip, setDayTrip] = useState<DayTrip | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/day-trips/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDayTrip(data.dayTrip);
          setAddons(data.addons || []);
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

  if (!dayTrip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl mb-4">Day trip not found</h1>
        <Link href="/day-trips" className="text-sm underline">
          Back to all day trips
        </Link>
      </div>
    );
  }

  // Split narrative into paragraphs
  const narrativeParagraphs = dayTrip.narrative
    .split("\n\n")
    .filter((p) => p.trim());

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] bg-[#e8e0d4]">
        {(dayTrip.heroImage || dayTrip.routeImage) && (
          <Image
            src={dayTrip.heroImage || dayTrip.routeImage}
            alt={dayTrip.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Category badge */}
        <div className="absolute top-24 left-6 md:left-16">
          <span className="text-xs tracking-[0.1em] uppercase bg-background/90 px-3 py-1.5">
            {dayTrip.category}
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {/* Back Link */}
          <Link
            href="/day-trips"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All Day Tours
          </Link>

          {/* Title & Meta */}
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              {dayTrip.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{dayTrip.durationHours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>From {dayTrip.departureCity}</span>
              </div>
              {dayTrip.difficulty && (
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  <span>{dayTrip.difficulty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 font-display italic">
            {dayTrip.shortDescription}
          </p>

          {/* Narrative */}
          <div className="prose prose-lg max-w-none mb-16">
            {narrativeParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-muted-foreground leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Via Cities */}
          {dayTrip.viaCities && (
            <div className="mb-12 pb-12 border-b border-border">
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Route
              </p>
              <p className="text-foreground">
                {dayTrip.fromCity} → {dayTrip.viaCities.split("|").join(" → ")} → {dayTrip.fromCity}
              </p>
            </div>
          )}

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Included
              </h3>
              <ul className="space-y-2">
                {dayTrip.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-olive mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Not Included
              </h3>
              <ul className="space-y-2">
                {dayTrip.excludes.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add-ons Preview */}
          {addons.length > 0 && (
            <div className="mb-12 p-6 bg-sand">
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Enhance Your Experience
              </h3>
              <div className="space-y-3">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span className="text-muted-foreground">+€{addon.priceEUR}/person</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking CTA */}
          <div className="bg-foreground text-background p-8 md:p-10 text-center">
            <p className="text-xs tracking-[0.2em] uppercase opacity-70 mb-2">
              Private day tour
            </p>
            <p className="text-3xl md:text-4xl font-serif mb-2">
              €{dayTrip.priceEUR}
            </p>
            <p className="text-sm opacity-70 mb-6">
              per car (up to 3 guests)
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-block bg-background text-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-background/90 transition-colors"
            >
              Book This Tour
            </button>
          </div>
        </div>
      </section>

      {/* Other Day Trips */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="font-serif text-2xl text-center mb-12">
            Other Day Tours
          </h2>
          <div className="text-center">
            <Link
              href="/day-trips"
              className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              View All Day Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <DayTripBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tripSlug={dayTrip.slug}
        tripTitle={dayTrip.title}
        basePriceMAD={dayTrip.priceMAD}
        basePriceEUR={dayTrip.priceEUR}
        addons={addons}
      />
    </div>
  );
}
