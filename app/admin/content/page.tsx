"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ContentBlock {
  Route_ID: string;
  Day_Number: string;
  From_City: string;
  To_City: string;
  Day_Title: string;
  Route_Description: string;
  Hero_Image_URL: string;
  Hero_Title: string;
  Hero_Blurb: string;
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRoute, setFilterRoute] = useState("ALL");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Get unique routes
  const routes = ["ALL", ...Array.from(new Set(content.map((c) => c.Route_ID).filter(Boolean)))];

  // Filter content
  const filteredContent = filterRoute === "ALL" 
    ? content 
    : content.filter((c) => c.Route_ID === filterRoute);

  // Group by route
  const groupedContent = filteredContent.reduce((acc: { [key: string]: ContentBlock[] }, item) => {
    const routeId = item.Route_ID || "Unknown";
    if (!acc[routeId]) {
      acc[routeId] = [];
    }
    acc[routeId].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-background/70 hover:text-background">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-light tracking-wide">Content Library</h1>
          </div>
          <span className="text-sm text-background/60">
            {routes.length - 1} routes
          </span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filter */}
        <div className="bg-background p-4 border border-border mb-6">
          <select
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
          >
            {routes.map((route) => (
              <option key={route} value={route}>
                {route === "ALL" ? "All Routes" : route}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : Object.keys(groupedContent).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No content found.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedContent).map(([routeId, blocks]) => (
              <div key={routeId} className="bg-background border border-border">
                <div className="p-4 border-b border-border">
                  <h2 className="font-serif text-xl">{routeId}</h2>
                  <p className="text-sm text-muted-foreground">{blocks.length} days</p>
                </div>
                <div className="divide-y divide-border">
                  {blocks
                    .sort((a, b) => parseInt(a.Day_Number) - parseInt(b.Day_Number))
                    .map((block, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">
                            Day {block.Day_Number}: {block.Day_Title || `${block.From_City} → ${block.To_City}`}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {block.From_City} → {block.To_City}
                        </p>
                        {block.Route_Description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {block.Route_Description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 p-6 bg-background border border-border">
          <h3 className="font-serif text-lg mb-2">Content Library</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The Content Library contains reusable route descriptions and day-by-day content.
            This content is used to build proposals and journey pages.
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
