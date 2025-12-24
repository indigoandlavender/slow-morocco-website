"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Settings {
  hero_image_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  how_it_works_step1_title?: string;
  how_it_works_step1_desc?: string;
  how_it_works_step2_title?: string;
  how_it_works_step2_desc?: string;
  how_it_works_step3_title?: string;
  how_it_works_step3_desc?: string;
  testimonials_title?: string;
}

export default function HomePage() {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/journeys").then((r) => r.json()),
      fetch("/api/testimonials").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([journeysData, testimonialsData, settingsData]) => {
        setJourneys(journeysData.journeys || []);
        setTestimonials(testimonialsData.testimonials || []);
        setSettings(settingsData.settings || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // No fallback - beige background if no image
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Update hero image when settings load
  useEffect(() => {
    if (settings.hero_image_url && !imageError) {
      setHeroImage(settings.hero_image_url);
    } else {
      setHeroImage(null);
    }
  }, [settings.hero_image_url, imageError]);

  const handleImageError = () => {
    console.error("Hero image failed to load");
    setImageError(true);
    setHeroImage(null);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section - Full viewport height */}
      <section className="relative h-screen overflow-hidden bg-[#e8e0d4]">
        {heroImage && (
          // Using regular img tag to bypass Next.js image caching
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={heroImage}
            src={heroImage}
            alt="Morocco landscape"
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </section>

      {/* Featured Journeys Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Journeys</h2>
            <p className="text-muted-foreground italic font-display text-lg">
              Private routes through Morocco's soul
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative">
              {/* Carousel navigation */}
              <button
                onClick={() => {
                  const container = document.getElementById('journeys-carousel');
                  if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-background border border-border rounded-full hover:bg-muted transition-colors tap-target hidden md:flex items-center justify-center"
                aria-label="Previous journeys"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const container = document.getElementById('journeys-carousel');
                  if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-background border border-border rounded-full hover:bg-muted transition-colors tap-target hidden md:flex items-center justify-center"
                aria-label="Next journeys"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel container */}
              <div
                id="journeys-carousel"
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {journeys.map((journey: any) => (
                  <Link
                    key={journey.slug}
                    href={`/journeys/${journey.slug}`}
                    className="group flex-shrink-0 w-[280px] md:w-[300px] snap-start"
                  >
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#e8e0d4]">
                      {journey.heroImage && (
                        <Image
                          src={journey.heroImage}
                          alt={journey.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <h3 className="font-serif text-lg mb-2">
                      {journey.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {journey.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/journeys"
              className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
            >
              View All Journeys
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">What Travelers Say</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="relative">
              <div className="flex items-center justify-center gap-8">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 border border-border rounded-full hover:bg-muted transition-colors tap-target"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="text-center flex-1 max-w-2xl">
                  <blockquote className="text-xl md:text-2xl italic text-muted-foreground leading-relaxed mb-6 font-display">
                    "{testimonials[testimonialIndex].quote}"
                  </blockquote>
                  <a 
                    href="#" 
                    className="text-sm underline text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
                  >
                    Read more
                  </a>
                  <p className="text-xs tracking-[0.2em] uppercase mt-4">
                    {testimonials[testimonialIndex].author}
                  </p>
                </div>

                <button 
                  onClick={nextTestimonial}
                  className="p-2 border border-border rounded-full hover:bg-muted transition-colors tap-target"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl md:text-2xl italic text-muted-foreground leading-relaxed mb-6 font-display">
                "A brilliant introduction to Morocco. The whole experience was amazing. Well organised and thought out, I couldn't wish for a better introduction to Morocco. All of the accommodations were interesting ..."
              </p>
              <a href="#" className="text-sm underline text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
                Read more
              </a>
              <p className="text-xs tracking-[0.2em] uppercase mt-4">
                ANGELA A
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-20">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-serif text-muted-foreground/40 mb-6">1</div>
              <h3 className="font-serif text-xl mb-4">
                {settings.how_it_works_step1_title || "You reach out"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {settings.how_it_works_step1_desc || "Tell us what's stirring. A journey that caught your attention. A question. A sense that something here is yours."}
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl font-serif text-muted-foreground/40 mb-6">2</div>
              <h3 className="font-serif text-xl mb-4">
                {settings.how_it_works_step2_title || "We build it"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {settings.how_it_works_step2_desc || "We shape the route around what matters to you. Add days. Remove cities. Stay longer where something pulls you."}
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl font-serif text-muted-foreground/40 mb-6">3</div>
              <h3 className="font-serif text-xl mb-4">
                {settings.how_it_works_step3_title || "You go"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {settings.how_it_works_step3_desc || "Deposit secures your dates. Balance due 60 days before. Then you pack light and show up."}
              </p>
            </div>
          </div>

          <div className="text-center mt-20">
            <Link
              href="/plan-your-trip"
              className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
            >
              Start The Conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
