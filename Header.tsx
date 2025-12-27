"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-sm md:text-base tracking-[0.12em] text-foreground whitespace-nowrap">
              S L O W &nbsp; M O R O C C O
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/journeys"
              className="text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
            >
              Journeys
            </Link>
            <Link
              href="/places"
              className="text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
            >
              Places
            </Link>
            <Link
              href="/about"
              className="text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
            >
              About
            </Link>

            {/* Plan Your Trip button */}
            <Link
              href="/plan-your-trip"
              className="text-xs tracking-[0.15em] uppercase border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-background transition-colors whitespace-nowrap"
            >
              Plan Your Trip
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 tap-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-8 pt-4 space-y-6 border-t border-border">
            <Link
              href="/journeys"
              className="block text-sm tracking-[0.15em] uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              Journeys
            </Link>
            <Link
              href="/places"
              className="block text-sm tracking-[0.15em] uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              Places
            </Link>
            <Link
              href="/about"
              className="block text-sm tracking-[0.15em] uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/plan-your-trip"
              className="inline-block text-sm tracking-[0.15em] uppercase border border-foreground px-5 py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plan Your Trip
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
