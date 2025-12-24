"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ContentBlock {
  id: string;
  cityName: string;
  dayTitle: string;
  description: string;
  imageUrl: string;
  heroImageUrl: string;
  fromCity: string;
  toCity: string;
  dayNumber: string;
  highlights: string;
  activities: string;
  meals: string;
  accommodationType: string;
  region: string;
  subRegion: string;
}

interface DayItinerary {
  id: string;
  dayNumber: number;
  title: string;
  fromCity: string;
  toCity: string;
  description: string;
  accommodation: string;
  meals: string[];
  activities: string[];
  imageUrl: string;
}

interface QuoteData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCountry: string;
  travelers: number;
  startDate: string;
  endDate: string;
  hospitalityLevel: string;
  journeyInterest: string;
  totalPrice: string;
  notes: string;
}

const defaultDay: Omit<DayItinerary, "id" | "dayNumber"> = {
  title: "",
  fromCity: "",
  toCity: "",
  description: "",
  accommodation: "",
  meals: [],
  activities: [],
  imageUrl: "",
};

// Icons
const Icons = {
  plus: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M5 4V2h6v2M6 7v6M10 7v6M3 4l1 10h8l1-10" />
    </svg>
  ),
  chevronUp: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10l4-4 4 4" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6l4 4 4-4" />
    </svg>
  ),
  grip: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  ),
};

export default function EditQuotePage() {
  // Content Library data
  const [contentLibrary, setContentLibrary] = useState<ContentBlock[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // Fetch content library on mount
  useEffect(() => {
    fetch("/api/content-library")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setContentLibrary(data.contentBlocks || []);
        }
        setLoadingContent(false);
      })
      .catch((err) => {
        console.error("Failed to load content library:", err);
        setLoadingContent(false);
      });
  }, []);

  // Quote metadata
  const [quote, setQuote] = useState<QuoteData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientCountry: "",
    travelers: 2,
    startDate: "",
    endDate: "",
    hospitalityLevel: "BOUTIQUE",
    journeyInterest: "",
    totalPrice: "",
    notes: "",
  });

  // Itinerary days - start with one empty day
  const [days, setDays] = useState<DayItinerary[]>([
    {
      id: "day-1",
      dayNumber: 1,
      title: "",
      fromCity: "",
      toCity: "",
      description: "",
      accommodation: "",
      meals: [],
      activities: [],
      imageUrl: "",
    },
  ]);

  // Expanded day panels
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(["day-1"]));

  // Apply content from library to a day
  const applyContentToDay = (dayId: string, contentBlock: ContentBlock) => {
    setDays(days.map((d) => {
      if (d.id === dayId) {
        return {
          ...d,
          title: contentBlock.toCity || contentBlock.dayTitle || contentBlock.cityName,
          fromCity: contentBlock.fromCity,
          toCity: contentBlock.toCity,
          description: contentBlock.description,
          imageUrl: contentBlock.imageUrl || contentBlock.heroImageUrl,
          activities: contentBlock.activities ? contentBlock.activities.split(",").map(s => s.trim()) : [],
          meals: contentBlock.meals ? contentBlock.meals.split(",").map(s => s.trim()) : [],
          accommodation: contentBlock.accommodationType,
        };
      }
      return d;
    }));
  };

  // Toggle day expansion
  const toggleDay = (id: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDays(newExpanded);
  };

  // Add new day
  const addDay = () => {
    const newId = `day-${Date.now()}`;
    const newDayNumber = days.length + 1;
    setDays([
      ...days,
      {
        id: newId,
        dayNumber: newDayNumber,
        ...defaultDay,
      },
    ]);
    setExpandedDays(new Set([...Array.from(expandedDays), newId]));
  };

  // Remove day
  const removeDay = (id: string) => {
    if (days.length <= 1) return;
    const newDays = days.filter((d) => d.id !== id);
    // Renumber days
    newDays.forEach((d, i) => {
      d.dayNumber = i + 1;
    });
    setDays(newDays);
  };

  // Update day
  const updateDay = (id: string, field: keyof DayItinerary, value: any) => {
    setDays(days.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  // Move day up/down
  const moveDay = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === days.length - 1) return;

    const newDays = [...days];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newDays[index], newDays[swapIndex]] = [newDays[swapIndex], newDays[index]];

    // Renumber days
    newDays.forEach((d, i) => {
      d.dayNumber = i + 1;
    });
    setDays(newDays);
  };

  // Save quote
  const handleSave = () => {
    console.log("Saving quote:", { quote, days });
    alert("Quote saved! (Console log for now)");
  };

  // Generate itinerary - saves data and opens the client-ready proposal page
  const handleGenerateItinerary = () => {
    // Generate a unique proposal ID
    const proposalId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Parse client name for title
    const nameParts = (quote.clientName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const journeyTitle = quote.clientName 
      ? `Bespoke Journey for ${firstName} ${lastName}`.trim()
      : "Your Morocco Journey";
    
    // Use Day 1's image as hero image (from Content_Library)
    const heroImage = days[0]?.imageUrl || "";
    
    // Prepare proposal data
    const proposalData = {
      id: proposalId,
      journeyTitle,
      arcDescription: `A journey crafted for ${quote.clientName || "you"} — ${days.length} days exploring Morocco's most captivating corners, from ancient medinas to sweeping desert landscapes.`,
      clientName: quote.clientName || "",
      heroImage,
      days: days.map(day => ({
        dayNumber: day.dayNumber,
        title: day.title || day.toCity || "Morocco",
        description: day.description || "Your journey continues...",
        imageUrl: day.imageUrl || ""
      }))
    };
    
    // Save to localStorage (later: save to database)
    localStorage.setItem(`proposal-${proposalId}`, JSON.stringify(proposalData));
    
    // Open the proposal page
    window.open(`/proposal/${proposalId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-background border-b border-border py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/quotes" className="text-muted-foreground hover:text-foreground transition-colors">
              ← All Quotes
            </Link>
            <h1 className="font-serif text-xl">Edit Quote</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateItinerary}
              className="px-4 py-2 text-sm border border-border hover:border-foreground transition-colors"
            >
              Generate Itinerary
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Save Quote
            </button>
          </div>
        </div>
      </header>

      {/* Search Existing Journey */}
      <div className="bg-background border-b border-border py-6 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search existing journeys to use as template..."
                className="w-full pl-10 pr-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground rounded-lg"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3 3" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">or start from scratch below</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Client Info & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Information */}
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="font-serif text-lg mb-4">Client Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Client Name</label>
                  <input
                    type="text"
                    value={quote.clientName}
                    onChange={(e) => setQuote({ ...quote, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={quote.clientEmail}
                    onChange={(e) => setQuote({ ...quote, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                  <input
                    type="tel"
                    value={quote.clientPhone}
                    onChange={(e) => setQuote({ ...quote, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Country</label>
                  <input
                    type="text"
                    value={quote.clientCountry}
                    onChange={(e) => setQuote({ ...quote, clientCountry: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Journey Details */}
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="font-serif text-lg mb-4">Journey Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={quote.travelers}
                    onChange={(e) => setQuote({ ...quote, travelers: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Start Date</label>
                    <input
                      type="date"
                      value={quote.startDate}
                      onChange={(e) => setQuote({ ...quote, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">End Date</label>
                    <input
                      type="date"
                      value={quote.endDate}
                      onChange={(e) => setQuote({ ...quote, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Hospitality Level</label>
                  <select
                    value={quote.hospitalityLevel}
                    onChange={(e) => setQuote({ ...quote, hospitalityLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                  >
                    <option value="ESSENTIALS">Essentials</option>
                    <option value="BOUTIQUE">Boutique</option>
                    <option value="SIGNATURE">Signature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Total Price</label>
                  <input
                    type="text"
                    value={quote.totalPrice}
                    onChange={(e) => setQuote({ ...quote, totalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                    placeholder="$4,500 USD"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-foreground text-background rounded-xl p-6">
              <h2 className="font-serif text-lg mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-background/70">Duration</span>
                  <span>{days.length} days / {days.length - 1} nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-background/70">Travelers</span>
                  <span>{quote.travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-background/70">Level</span>
                  <span>{quote.hospitalityLevel}</span>
                </div>
                {quote.totalPrice && (
                  <div className="flex justify-between pt-3 border-t border-background/20">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{quote.totalPrice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Itinerary Builder */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Itinerary</h2>
              <button
                onClick={addDay}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border hover:border-foreground transition-colors rounded-lg"
              >
                {Icons.plus}
                Add Day
              </button>
            </div>

            {/* Days */}
            <div className="space-y-4">
              {days.map((day, index) => (
                <div key={day.id} className="bg-background border border-border rounded-xl overflow-hidden">
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleDay(day.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{Icons.grip}</span>
                      <div>
                        <span className="font-medium">Day {day.dayNumber}</span>
                        {day.title && <span className="text-muted-foreground ml-2">— {day.title}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {day.fromCity && day.toCity && (
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                          {day.fromCity} → {day.toCity}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {expandedDays.has(day.id) ? Icons.chevronUp : Icons.chevronDown}
                      </span>
                    </div>
                  </div>

                  {/* Day Content (expanded) */}
                  {expandedDays.has(day.id) && (
                    <div className="border-t border-border p-6">
                      {/* Content Library Selector */}
                      {contentLibrary.length > 0 && (
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <label className="block text-sm text-muted-foreground mb-2">
                            Quick Fill from Content Library ({contentLibrary.length} blocks available)
                          </label>
                          <select
                            onChange={(e) => {
                              const content = contentLibrary.find(c => c.id === e.target.value);
                              if (content) {
                                applyContentToDay(day.id, content);
                              }
                            }}
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground bg-background"
                            defaultValue=""
                          >
                            <option value="" disabled>Select content block...</option>
                            {contentLibrary.map((content) => (
                              <option key={content.id} value={content.id}>
                                {content.fromCity && content.toCity 
                                  ? `${content.fromCity} → ${content.toCity}`
                                  : content.toCity || content.dayTitle || content.cityName
                                } {content.region ? `(${content.region})` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Day Title (City)</label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateDay(day.id, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                            placeholder="e.g., Marrakech"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Image URL</label>
                          <input
                            type="text"
                            value={day.imageUrl}
                            onChange={(e) => updateDay(day.id, "imageUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm text-muted-foreground mb-1">Description</label>
                        <textarea
                          value={day.description}
                          onChange={(e) => updateDay(day.id, "description", e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground resize-none"
                          placeholder="Describe the day's journey and experiences..."
                        />
                      </div>

                      {/* Image Preview */}
                      {day.imageUrl && (
                        <div className="mb-4">
                          <label className="block text-sm text-muted-foreground mb-1">Image Preview</label>
                          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={day.imageUrl}
                              alt={day.title || "Day image"}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Day Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveDay(index, "up")}
                            disabled={index === 0}
                            className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            {Icons.chevronUp}
                          </button>
                          <button
                            onClick={() => moveDay(index, "down")}
                            disabled={index === days.length - 1}
                            className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            {Icons.chevronDown}
                          </button>
                        </div>
                        <button
                          onClick={() => removeDay(day.id)}
                          disabled={days.length <= 1}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          {Icons.trash}
                          Remove Day
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Day Button (bottom) */}
            <button
              onClick={addDay}
              className="w-full mt-4 py-4 border-2 border-dashed border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              {Icons.plus}
              Add Another Day
            </button>

            {/* Notes */}
            <div className="mt-8 bg-background border border-border rounded-xl p-6">
              <h3 className="font-serif text-lg mb-4">Internal Notes</h3>
              <textarea
                value={quote.notes}
                onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-foreground resize-none"
                placeholder="Notes about this quote (not visible to client)..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
