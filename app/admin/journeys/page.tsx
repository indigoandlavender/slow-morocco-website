"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Journey {
  journeyId: string;
  title: string;
  slug: string;
  heroImage: string;
  description: string;
  durationDays: number;
  startCity: string;
  focus: string;
  published: boolean;
}

export default function AdminJourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journeys?includeUnpublished=true")
      .then((r) => r.json())
      .then((data) => {
        setJourneys(data.journeys || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-background/70 hover:text-background">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-light tracking-wide">Journeys</h1>
          </div>
          <span className="text-sm text-background/60">
            {journeys.filter(j => j.published).length} published
          </span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : journeys.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No journeys found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey) => (
              <div
                key={journey.journeyId}
                className={`bg-background border transition-colors ${
                  journey.published ? "border-border" : "border-dashed border-muted-foreground/30"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {journey.heroImage ? (
                    <Image
                      src={journey.heroImage}
                      alt={journey.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  {!journey.published && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Draft
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-xl">{journey.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {journey.durationDays} days
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {journey.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {journey.startCity && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {journey.startCity}
                      </span>
                    )}
                    {journey.focus && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {journey.focus}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 text-sm">
                    <Link
                      href={`/journeys/${journey.slug}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 p-6 bg-background border border-border">
          <h3 className="font-serif text-lg mb-2">Managing Journeys</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Journeys are managed directly in Google Sheets. To add or edit journeys:
          </p>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Open the <strong>Website_Journeys</strong> tab in your Google Sheet</li>
            <li>Add or edit journey details (title, description, images, etc.)</li>
            <li>Set <strong>Published</strong> to TRUE to show on the website</li>
            <li>Add day-by-day itinerary in the <strong>Website_Itinerary_Days</strong> tab</li>
          </ol>
          <a
            href="https://docs.google.com/spreadsheets/d/1pXP4zRis6vqPFNPEAj0jLe3JU9QpN_isImwY6-wtt04/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm underline hover:no-underline"
          >
            Open Google Sheets →
          </a>
        </div>
      </main>
    </div>
  );
}
