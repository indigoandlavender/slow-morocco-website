"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Accommodation {
  Accommodation_ID: string;
  Region: string;
  Subregion: string;
  Hospitality_Level: string;
  Accommodation_Type: string;
  Accommodation_Name: string;
  Website_Url: string;
  Description_Short: string;
  Strengths: string;
}

export default function AdminAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/accommodations")
      .then((r) => r.json())
      .then((data) => {
        setAccommodations(data.accommodations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Get unique regions and levels for filters
  const regions = ["ALL", ...Array.from(new Set(accommodations.map((a) => a.Region).filter(Boolean)))];
  const levels = ["ALL", ...Array.from(new Set(accommodations.map((a) => a.Hospitality_Level).filter(Boolean)))];

  // Filter accommodations
  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesRegion = filterRegion === "ALL" || acc.Region === filterRegion;
    const matchesLevel = filterLevel === "ALL" || acc.Hospitality_Level === filterLevel;
    const matchesSearch = !searchQuery || 
      acc.Accommodation_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.Subregion?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-background/70 hover:text-background">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-light tracking-wide">Accommodations</h1>
          </div>
          <span className="text-sm text-background/60">
            {accommodations.length} total
          </span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-background p-4 border border-border mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
            />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "ALL" ? "All Regions" : region}
                </option>
              ))}
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "ALL" ? "All Levels" : level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No accommodations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccommodations.map((acc) => (
              <div
                key={acc.Accommodation_ID}
                className="bg-background p-6 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg">{acc.Accommodation_Name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    acc.Hospitality_Level === "SIGNATURE" ? "bg-amber-100 text-amber-800" :
                    acc.Hospitality_Level === "BOUTIQUE" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {acc.Hospitality_Level}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {acc.Subregion}, {acc.Region}
                </p>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {acc.Accommodation_Type}
                </p>
                
                {acc.Description_Short && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {acc.Description_Short}
                  </p>
                )}

                {acc.Website_Url && (
                  <a
                    href={acc.Website_Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 p-6 bg-background border border-border">
          <h3 className="font-serif text-lg mb-2">Managing Accommodations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Accommodations are managed in the <strong>Accommodations_Master</strong> tab of your Google Sheet.
          </p>
          <a
            href="https://docs.google.com/spreadsheets/d/1pXP4zRis6vqPFNPEAj0jLe3JU9QpN_isImwY6-wtt04/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm underline hover:no-underline"
          >
            Open Google Sheets →
          </a>
        </div>
      </main>
    </div>
  );
}
