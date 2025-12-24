"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface DashboardStats {
  newLeads: number;
  inProgress: number;
  totalQuotes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newLeads: 0,
    inProgress: 0,
    totalQuotes: 0,
  });

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((data) => {
        const quotes = data.quotes || [];
        setStats({
          newLeads: quotes.filter((q: any) => q.Status === "NEW").length,
          inProgress: quotes.filter((q: any) => q.Status === "IN_PROGRESS").length,
          totalQuotes: quotes.length,
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-serif text-3xl">Admin</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Site →
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <p className="text-4xl font-serif">{stats.newLeads}</p>
            <p className="text-sm text-muted-foreground mt-1">New</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-serif">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground mt-1">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-serif">{stats.totalQuotes}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Quotes</p>
          </div>
        </div>

        {/* Primary Tools */}
        <div className="space-y-4 mb-16">
          <Link
            href="/admin/create"
            className="block p-8 border border-border hover:border-foreground transition-colors"
          >
            <h2 className="font-serif text-2xl mb-2">Quote Builder</h2>
            <p className="text-muted-foreground">
              Create a custom journey quote for a client
            </p>
          </Link>

          <Link
            href="/admin/quotes"
            className="block p-8 border border-border hover:border-foreground transition-colors"
          >
            <h2 className="font-serif text-2xl mb-2">View All Quotes</h2>
            <p className="text-muted-foreground">
              See and manage all quote requests
            </p>
          </Link>

          <Link
            href="/admin/pricing"
            className="block p-8 border border-border hover:border-foreground transition-colors"
          >
            <h2 className="font-serif text-2xl mb-2">Price Calculator</h2>
            <p className="text-muted-foreground">
              Calculate journey costs and margins
            </p>
          </Link>
        </div>

        {/* Secondary Tools */}
        <div className="border-t border-border pt-12">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-6">Other Tools</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/journeys"
              className="p-4 border border-border hover:border-foreground transition-colors text-center"
            >
              <p className="text-sm">Journeys</p>
            </Link>
            <Link
              href="/admin/accommodations"
              className="p-4 border border-border hover:border-foreground transition-colors text-center"
            >
              <p className="text-sm">Accommodations</p>
            </Link>
            <Link
              href="/admin/content"
              className="p-4 border border-border hover:border-foreground transition-colors text-center"
            >
              <p className="text-sm">Content Library</p>
            </Link>
            <Link
              href="/admin/settings"
              className="p-4 border border-border hover:border-foreground transition-colors text-center"
            >
              <p className="text-sm">Settings</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
