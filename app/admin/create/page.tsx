"use client";

import { Suspense } from "react";
import Link from "next/link";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-serif text-3xl">Dashboard</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Site →
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Proposal Builder Section */}
        <div className="border border-border p-12 text-center mb-8">
          <h2 className="font-serif text-3xl mb-4">Proposal Builder</h2>
          <p className="text-muted-foreground mb-10">
            Create and manage client proposals
          </p>

          {/* 3 Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/quotes/new"
              className="block p-6 bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <h3 className="font-serif text-lg mb-2">Build a Proposal</h3>
              <p className="text-sm text-background/70">
                Create new proposal
              </p>
            </Link>

            <Link
              href="/admin/quotes"
              className="block p-6 border border-border hover:border-foreground transition-colors"
            >
              <h3 className="font-serif text-lg mb-2">Browse All Proposals</h3>
              <p className="text-sm text-muted-foreground">
                View and manage quotes
              </p>
            </Link>

            <Link
              href="/admin/pricing"
              className="block p-6 border border-border hover:border-foreground transition-colors"
            >
              <h3 className="font-serif text-lg mb-2">Price Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Calculate costs
              </p>
            </Link>
          </div>
        </div>

        {/* Other Tools */}
        <div className="border-t border-border pt-8">
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

export default function CreateProposalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
