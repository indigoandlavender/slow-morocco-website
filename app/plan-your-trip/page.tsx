"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanYourTripForm from "@/components/PlanYourTripForm";

interface Journey {
  slug: string;
  title: string;
}

export default function PlanYourTripPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch journeys for dropdown
    fetch("/api/journeys")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJourneys(data.journeys || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      {/* Main Content */}
      <div className="pt-20">
        <div className="container mx-auto px-6 lg:px-16 py-16 md:py-24 max-w-2xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl tracking-wide mb-4">
              Plan Your Journey
            </h1>
            <p className="text-muted-foreground italic">
              We respond within 24 hours, usually sooner. No obligation, no sales pitch—just a conversation about what you're hoping to find.
            </p>
          </div>

          {/* Form */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading...
            </div>
          ) : (
            <PlanYourTripForm 
              journeys={journeys}
              siteId="slow-morocco"
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
