"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Settings {
  [key: string]: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const settingsGroups = [
    {
      title: "Hero Section",
      keys: ["hero_image_url", "hero_title", "hero_subtitle"],
    },
    {
      title: "Site Information",
      keys: ["site_name", "site_tagline", "contact_email", "contact_address_line1", "contact_address_line2"],
    },
    {
      title: "How It Works",
      keys: [
        "how_it_works_step1_title", "how_it_works_step1_desc",
        "how_it_works_step2_title", "how_it_works_step2_desc",
        "how_it_works_step3_title", "how_it_works_step3_desc",
      ],
    },
    {
      title: "Section Titles",
      keys: ["testimonials_title", "guides_title", "guides_subtitle"],
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-background/70 hover:text-background">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-light tracking-wide">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {settingsGroups.map((group) => (
              <div key={group.title} className="bg-background p-6 border border-border">
                <h2 className="font-serif text-xl mb-6">{group.title}</h2>
                <div className="space-y-4">
                  {group.keys.map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {key.replace(/_/g, " ")}
                      </label>
                      <div className="p-3 bg-muted border border-border text-sm">
                        {settings[key] || <span className="text-muted-foreground italic">Not set</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Help Text */}
            <div className="p-6 bg-background border border-border">
              <h3 className="font-serif text-lg mb-2">Editing Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Settings are managed in the <strong>Website_Settings</strong> tab of your Google Sheet.
                Each row has a Key and Value column.
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
          </div>
        )}
      </main>
    </div>
  );
}
