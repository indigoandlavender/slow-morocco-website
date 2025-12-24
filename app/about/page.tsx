import Link from "next/link";
import { getSheetData } from "@/lib/sheets";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageSection {
  page_id: string;
  page_title: string;
  section_order: number;
  section_title: string;
  section_content: string;
  section_type?: string;
  section_image?: string;
}

interface AboutSettings {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  quote_text?: string;
}

async function getAboutContent() {
  try {
    // Get page sections from Website_Pages
    const pagesData = await getSheetData("Website_Pages");
    const aboutSections = pagesData
      .filter((row: any) => row.page_id === "about")
      .sort((a: any, b: any) => (parseInt(a.section_order) || 0) - (parseInt(b.section_order) || 0));

    // Get settings for hero/quote from Website_Settings
    const settingsData = await getSheetData("Website_Settings");
    const settings: { [key: string]: string } = {};
    settingsData.forEach((row: any) => {
      if (row.Key) settings[row.Key] = row.Value || "";
    });

    return {
      sections: aboutSections as PageSection[],
      settings: {
        hero_title: settings.about_hero_title || "A B O U T\nU S",
        hero_subtitle: settings.about_hero_subtitle || "A different kind of travel company, built on honesty and human connection.",
        hero_image: settings.about_hero_image || "",
        quote_text: settings.about_quote || "We'd rather lose a booking than promise something we can't deliver.",
        site_name: settings.site_name || "Slow World",
      } as AboutSettings & { site_name: string },
    };
  } catch (error) {
    console.error("Error fetching about content:", error);
    return {
      sections: [],
      settings: {
        hero_title: "A B O U T\nU S",
        hero_subtitle: "A different kind of travel company, built on honesty and human connection.",
        hero_image: "",
        quote_text: "We'd rather lose a booking than promise something we can't deliver.",
        site_name: "Slow World",
      },
    };
  }
}

export default async function AboutPage() {
  const { sections, settings } = await getAboutContent();

  // Group sections by type for different rendering
  const introSections = sections.filter(s => s.section_type === "intro" || s.section_order <= 3);
  const standardSections = sections.filter(s => s.section_type === "standard" || (!s.section_type && s.section_order > 3 && s.section_order < 90));
  const valuesSections = sections.filter(s => s.section_type === "values");

  // If no sections from database, show a message
  const hasContent = sections.length > 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 md:pt-40 md:pb-28 bg-muted"
        style={settings.hero_image ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${settings.hero_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light mb-8 whitespace-pre-line ${settings.hero_image ? 'text-white' : ''}`}>
            {settings.hero_title}
          </h1>
          <p className={`text-lg md:text-xl ${settings.hero_image ? 'text-white/90' : 'text-muted-foreground'}`}>
            {settings.hero_subtitle}
          </p>
        </div>
      </section>

      {hasContent ? (
        <>
          {/* Intro Sections */}
          {introSections.length > 0 && (
            <section className="py-20 md:py-28">
              <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
                {introSections.map((section, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    {section.section_title && section.section_title !== "Introduction" && (
                      <h2 className="text-xl md:text-2xl tracking-[0.2em] font-light mb-6">
                        {section.section_title.toUpperCase().split('').join(' ')}
                      </h2>
                    )}
                    <p className="text-muted-foreground leading-relaxed">
                      {section.section_content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Standard Sections - alternating backgrounds */}
          {standardSections.map((section, index) => (
            <section 
              key={section.section_order} 
              className={`py-20 md:py-28 ${index % 2 === 0 ? 'bg-sand' : ''}`}
            >
              <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
                {section.section_title && (
                  <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
                    {section.section_title.toUpperCase().split('').join(' ')}
                  </h2>
                )}
                <div className="text-muted-foreground leading-relaxed space-y-6">
                  {section.section_content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Quote Section */}
          {settings.quote_text && (
            <section className="py-16 md:py-24 bg-sand">
              <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
                <p className="font-serif text-2xl md:text-4xl italic text-foreground leading-relaxed">
                  "{settings.quote_text}"
                </p>
              </div>
            </section>
          )}

          {/* Values/Standards Section */}
          {valuesSections.length > 0 && (
            <section className="py-20 md:py-28">
              <div className="container mx-auto px-6 lg:px-16">
                <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light text-center mb-16">
                  O U R &nbsp; S T A N D A R D S
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                  {valuesSections.map((section, index) => (
                    <div key={index} className="border-l border-border pl-6">
                      <h3 className="text-sm tracking-[0.2em] uppercase mb-4">
                        {section.section_title.split(' ').map((word, i) => (
                          <span key={i}>{word}<br/></span>
                        ))}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.section_content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* Fallback content when no database content */
        <>
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {settings.site_name} grew from a quiet understanding that emerged after years of guiding travelers through landscapes most never see.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What we learned was simple: the most profound journeys happen not when you see more, but when you see clearly. When you stop performing and start noticing. When you remove the rush and discover what remains.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {settings.site_name} exists for travelers who recognize that depth requires time, and clarity requires space.
              </p>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-sand">
            <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
              <p className="font-serif text-2xl md:text-4xl italic text-foreground leading-relaxed">
                "{settings.quote_text}"
              </p>
            </div>
          </section>
        </>
      )}

      {/* CTA Section - always show */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-light mb-12">
            O U R &nbsp; P R O M I S E
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 italic font-display text-lg">
            You arrive. We remove the noise. The rest is simply being here.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            If you travel with us, this is what we offer: not perfection, but honesty. Not transformation, but space where it becomes possible.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Start A Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
