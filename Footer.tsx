"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Social Icons - flat, minimal, Anthropic style
function SocialIcon({ name }: { name: string }) {
  const icons: { [key: string]: JSX.Element } = {
    pinterest: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6C8 6 6.5 7.5 6.5 9.5C6.5 11 7.5 12 8.5 12.5C8 14 7.5 15.5 7.5 15.5" />
        <path d="M10 6C10 8 10 14 10 14" />
        <path d="M10 6C12 6 13.5 7.5 13.5 9.5C13.5 11.5 12 12.5 10 12.5" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="3" y="3" width="14" height="14" rx="4" />
        <circle cx="10" cy="10" r="3.5" />
        <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="2" y="4" width="16" height="12" rx="3" />
        <path d="M8 7.5V12.5L13 10L8 7.5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="10" cy="10" r="8" />
        <path d="M10.5 17V10H13L13.5 7.5H10.5V6C10.5 5 11 4.5 12 4.5H13.5V2.5C13.5 2.5 12.5 2.5 11.5 2.5C9.5 2.5 8.5 3.5 8.5 5.5V7.5H6V10H8.5V17" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M3 15C5 15 7 14 8 12C4 12 3 9 3 7C4 8 5 8 6 8C3 6 3 3 5 2C7 4 9 5 12 5C12 3 13 1 16 2C17 2 18 1 18 1C18 2 17.5 3 17 4C18 4 18.5 3.5 18.5 3.5C18 4.5 17 5.5 17 5.5C17 11 13 16 7 16C5 16 3 15 3 15Z" />
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M10 2V14C10 15.5 8.5 17 7 17C5.5 17 4 15.5 4 14C4 12.5 5.5 11 7 11" />
        <path d="M10 2C10 2 10 5 14 5" />
        <path d="M10 6C10 6 10 8 16 8" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="2" y="2" width="16" height="16" rx="2" />
        <path d="M6 8V14" />
        <circle cx="6" cy="5.5" r="1" fill="currentColor" />
        <path d="M9 14V10C9 8.5 10 8 11 8C12.5 8 13 9 13 10V14" />
        <path d="M9 8V14" />
      </svg>
    ),
  };

  return icons[name] || <span className="text-sm">{name}</span>;
}

// Site configuration - determines footer behavior
interface SiteConfig {
  siteId: string;
  siteType: "planet" | "moon" | "microsite";
  siteCategory: "commercial" | "content";
  brandName: string;
  parentBrand?: string; // For "Powered by" - only moons and microsites
}

// Slow Morocco is a Planet (commercial)
const siteConfig: SiteConfig = {
  siteId: "slow-morocco",
  siteType: "planet",
  siteCategory: "commercial",
  brandName: "Slow Morocco",
  // No parentBrand - planets are the parent
};

// Slow World network - all countries
const SLOW_WORLD_COUNTRIES = [
  { id: "mauritius", name: "Mauritius", url: "https://slowmauritius.com" },
  { id: "morocco", name: "Morocco", url: "https://slowmorocco.com" },
  { id: "namibia", name: "Namibia", url: "https://slownamibia.com" },
  { id: "tunisia", name: "Tunisia", url: "https://slowtunisia.com" },
  { id: "turkiye", name: "Türkiye", url: "https://slowturkiye.com" },
];

interface FooterLink {
  order: number;
  label: string;
  href: string | null;
  type: string;
}

interface FooterColumn {
  number: number;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  newsletter: {
    backgroundImage: string;
    title: string;
    description: string;
  };
  columns: FooterColumn[];
  legal: { label: string; href: string }[];
}

const defaultFooterData: FooterData = {
  newsletter: {
    backgroundImage: "",
    title: "Notes from Morocco",
    description: "Quiet. Irregular. Real.",
  },
  columns: [
    {
      number: 1,
      title: "Contact",
      links: [
        { order: 1, label: "35 Derb Fhal Zfriti", href: null, type: "address" },
        { order: 2, label: "Marrakech Morocco", href: null, type: "address" },
        { order: 3, label: "+212 6 18 07 04 50", href: "https://wa.me/212618070450", type: "whatsapp" },
        { order: 4, label: "Pinterest", href: null, type: "social" },
        { order: 5, label: "Instagram", href: null, type: "social" },
        { order: 6, label: "YouTube", href: null, type: "social" },
      ],
    },
    {
      number: 2,
      title: "About Us",
      links: [
        { order: 1, label: "What We Offer", href: "/about", type: "link" },
        { order: 2, label: "Our Guides", href: "/guides", type: "link" },
        { order: 3, label: "Contact Us", href: "/contact", type: "link" },
      ],
    },
    {
      number: 3,
      title: "Journeys",
      links: [
        { order: 1, label: "All Journeys", href: "/journeys", type: "link" },
        { order: 2, label: "Plan Your Trip", href: "/plan-your-trip", type: "link" },
        { order: 3, label: "Day Trips", href: "/day-trips", type: "link" },
        { order: 4, label: "What's Included", href: "/whats-included", type: "link" },
        { order: 5, label: "FAQ", href: "/faq", type: "link" },
      ],
    },
    {
      number: 4,
      title: "Travel Info",
      links: [
        { order: 1, label: "Visa Information", href: "/visa-info", type: "link" },
        { order: 2, label: "Health & Safety", href: "/health-safety", type: "link" },
        { order: 3, label: "Travel Insurance", href: "/travel-insurance", type: "link" },
        { order: 4, label: "Cancellation Policy", href: "/cancellation-policy", type: "link" },
      ],
    },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Intellectual Property", href: "/intellectual-property" },
  ],
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Determine what to show based on site type
  const showNewsletter = siteConfig.siteType === "planet" || siteConfig.siteType === "moon";
  const showPoweredBy = siteConfig.siteType === "moon" || siteConfig.siteType === "microsite";
  const showDisclaimer = siteConfig.siteCategory === "content";
  const showCurrency = siteConfig.siteCategory === "commercial";

  useEffect(() => {
    fetch("/api/footer")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setFooterData({
            newsletter: data.data.newsletter || defaultFooterData.newsletter,
            columns: data.data.columns || defaultFooterData.columns,
            legal: data.data.legal || defaultFooterData.legal,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch footer data:", err);
      });
  }, []);

  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;
    
    setIsSubscribing(true);
    
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubscribed(true);
        setSubscribeMessage(data.message);
        setEmail("");
      } else {
        setSubscribeMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscribeMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer>
      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 1: Newsletter
          - SHOW for Planets and Moons
          - SKIP for Microsites
          ════════════════════════════════════════════════════════════════════ */}
      {showNewsletter && (
        <section className="relative py-20 md:py-28 bg-[#4a5043]">
          {/* Using regular img tag to bypass Next.js image caching */}
          {footerData.newsletter.backgroundImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={footerData.newsletter.backgroundImage}
              alt="Newsletter background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-6 lg:px-16 max-w-xl text-center text-white">
            <h3 className="font-serif text-3xl md:text-4xl mb-4">
              {footerData.newsletter.title}
            </h3>
            <p className="text-white/80 mb-8 italic font-display text-lg">
              {footerData.newsletter.description}
            </p>
            
            {subscribed ? (
              <p className="text-white/90">{subscribeMessage || "You're in."}</p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto items-end">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={isSubscribing}
                    className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-white/50 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 bg-white text-foreground text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </form>
                {subscribeMessage && !subscribed && (
                  <p className="text-white/70 text-sm mt-3">{subscribeMessage}</p>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 2: Brand Content
          - SHOW for all sites
          - Brand-specific navigation columns
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-foreground text-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {footerData.columns.map((column, index) => {
              // Separate social links from regular links
              const socialLinks = column.links.filter(link => 
                link.type === "social" || 
                ["pinterest", "instagram", "youtube", "facebook", "twitter", "tiktok", "linkedin"].includes(link.label.toLowerCase())
              );
              const regularLinks = column.links.filter(link => 
                link.type !== "social" && 
                !["pinterest", "instagram", "youtube", "facebook", "twitter", "tiktok", "linkedin"].includes(link.label.toLowerCase())
              );

              return (
                <div key={index}>
                  {/* Replace first column title with logo */}
                  {index === 0 ? (
                    <div className="mb-6">
                      <span className="font-serif text-sm tracking-[0.2em] text-white/90 block">
                        S L O W
                      </span>
                      <span className="font-serif text-sm tracking-[0.2em] text-white/90 block">
                        M O R O C C O
                      </span>
                    </div>
                  ) : (
                    <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/60">
                      {column.title}
                    </h4>
                  )}
                  {/* Regular links */}
                  <ul className="space-y-3">
                    {regularLinks.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href ? (
                          link.type === "link" ? (
                            <Link
                              href={link.href}
                              className="text-sm text-white/80 hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/80 hover:text-white transition-colors"
                            >
                              {link.label}
                            </a>
                          )
                        ) : (
                          <span className="text-sm text-white/80">{link.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {/* Social icons in a row */}
                  {socialLinks.length > 0 && (
                    <div className="flex items-center gap-4 mt-4">
                      {socialLinks.map((link, linkIndex) => {
                        const socialName = link.label.toLowerCase();
                        return link.href ? (
                          <a
                            key={linkIndex}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white transition-colors"
                            aria-label={link.label}
                          >
                            <SocialIcon name={socialName} />
                          </a>
                        ) : (
                          <span 
                            key={linkIndex}
                            className="text-white/80" 
                            aria-label={link.label}
                          >
                            <SocialIcon name={socialName} />
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 3: Legal
          - SHOW for all sites
          - Legal links + Language (content) / Currency (commercial)
          - Disclaimer sentence for content sites only
          - Copyright
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-foreground border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Disclaimer for content sites */}
          {showDisclaimer && (
            <p className="text-center text-xs text-white/40 mb-4">
              Independent travel resource. Not affiliated with any government agency. Information may change—please verify before travel.
            </p>
          )}
          
          {/* Legal links row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
            {footerData.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Separator */}
            <span className="text-white/20">|</span>
            
            {/* Language selector placeholder */}
            <button className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <line x1="1.5" y1="8" x2="14.5" y2="8" />
                <path d="M8 1.5C6 4 6 12 8 14.5" />
                <path d="M8 1.5C10 4 10 12 8 14.5" />
              </svg>
              English
            </button>
            
            {/* Currency for commercial sites */}
            {showCurrency && (
              <button className="text-xs text-white/50 hover:text-white/80 transition-colors">
                € EUR
              </button>
            )}
          </div>
          
          {/* Copyright */}
          <p className="text-center text-xs text-white/40">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </p>
          
          {/* Slow World Network - all 5 countries, current one underlined */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/10">
            {SLOW_WORLD_COUNTRIES.map((country, index) => {
              const isCurrent = country.id === siteConfig.siteId.replace('slow-', '');
              return (
                <span key={country.id} className="flex items-center">
                  {isCurrent ? (
                    <span className="text-xs text-white/60 underline underline-offset-4">
                      {country.name}
                    </span>
                  ) : (
                    <a
                      href={country.url}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      {country.name}
                    </a>
                  )}
                  {index < SLOW_WORLD_COUNTRIES.length - 1 && (
                    <span className="text-white/20 ml-4">·</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 4: Powered By
          - SKIP for Planets (they ARE the brand)
          - SHOW for Moons and Microsites
          ════════════════════════════════════════════════════════════════════ */}
      {showPoweredBy && siteConfig.parentBrand && (
        <section className="py-3 bg-foreground border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-16">
            <p className="text-center text-xs text-white/30">
              Powered by{" "}
              <a 
                href="https://slowmorocco.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors"
              >
                {siteConfig.parentBrand}
              </a>
            </p>
          </div>
        </section>
      )}
    </footer>
  );
}
