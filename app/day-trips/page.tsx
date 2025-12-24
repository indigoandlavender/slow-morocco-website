"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface DayTrip {
  slug: string;
  title: string;
  shortDescription: string;
  durationHours: number;
  priceMAD: number;
  priceEUR: number;
  category: string;
  heroImage: string;
}

export default function DayTripsPage() {
  const [dayTrips, setDayTrips] = useState<DayTrip[]>([]);
  const [heroImage, setHeroImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/day-trips")
      .then((r) => r.json())
      .then((data) => {
        setDayTrips(data.dayTrips || []);
        setHeroImage(data.heroImage || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] bg-[#e8e0d4]">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Day tours from Marrakech"
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="text-xs tracking-[0.2em] uppercase opacity-80 mb-4">
              From Marrakech
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Day Tours
            </h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Leave in the morning, return by evening. Private car, the freedom to stop wherever something catches your eye.
            </p>
          </div>
        </div>
      </section>

      {/* Day Trips Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : dayTrips.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No day trips available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {dayTrips.map((trip) => (
                <Link
                  key={trip.slug}
                  href={`/day-trips/${trip.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-[#e8e0d4]">
                    {trip.heroImage && (
                      <Image
                        src={trip.heroImage}
                        alt={trip.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-xs tracking-[0.1em] uppercase bg-background/90 px-3 py-1.5">
                        {trip.category}
                      </span>
                    </div>
                  </div>
                  
                  <h2 className="font-serif text-xl mb-2 group-hover:opacity-70 transition-opacity">
                    {trip.title}
                  </h2>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span>{trip.durationHours} hours</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>From €{trip.priceEUR}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {trip.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-20 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-12">
            What's Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-4">Every day tour includes</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-olive mt-1">✓</span>
                  Private car (up to 3 guests)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive mt-1">✓</span>
                  English-speaking driver
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive mt-1">✓</span>
                  Hotel pickup & drop-off in Marrakech
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive mt-1">✓</span>
                  All road fees and fuel
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-olive mt-1">✓</span>
                  Flexible stops for photos
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Not included</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-1">–</span>
                  Lunch (can be added)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-1">–</span>
                  Entrance fees to sites
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 mt-1">–</span>
                  Tips for driver
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Questions?
          </h2>
          <p className="text-muted-foreground mb-8">
            Not sure which day tour is right for you? Get in touch and we'll help you choose.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
