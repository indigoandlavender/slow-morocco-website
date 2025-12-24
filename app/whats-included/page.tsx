import { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "What's Included | Slow Morocco",
  description: "Discover what's included in every Slow Morocco journey.",
};

export default function WhatsIncludedPage() {
  const included = [
    {
      title: "Accommodation",
      items: [
        "Hand-picked riads, kasbahs, and boutique hotels",
        "Rooms selected for character and comfort",
        "Daily breakfast included",
        "Welcome amenities and local touches",
      ],
    },
    {
      title: "Transportation",
      items: [
        "Private vehicle with professional driver",
        "Airport/train station transfers",
        "All in-country transportation",
        "Comfortable, air-conditioned vehicles",
      ],
    },
    {
      title: "Experiences",
      items: [
        "Private guided experiences as per itinerary",
        "Cultural encounters and local connections",
        "Restaurant reservations at notable establishments",
        "Entrance fees to sites in your itinerary",
      ],
    },
    {
      title: "Support",
      items: [
        "Detailed digital travel guide",
        "24/7 on-trip support",
        "Local phone with data for your journey",
        "Pre-departure planning consultations",
      ],
    },
  ];

  const notIncluded = [
    "International flights",
    "Travel insurance (required)",
    "Meals not specified in itinerary",
    "Personal expenses and gratuities",
    "Optional activities not in itinerary",
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-center">What's Included</h1>
        <p className="text-muted-foreground text-center text-lg mb-16 max-w-2xl mx-auto">
          Every Slow Morocco journey is thoughtfully crafted to include everything you need 
          for a seamless, immersive experience.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {included.map((category) => (
            <div key={category.title} className="bg-sand p-8 rounded-sm">
              <h2 className="font-serif text-2xl mb-6">{category.title}</h2>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-12">
          <h2 className="font-serif text-2xl mb-6 text-center">Not Included</h2>
          <ul className="max-w-md mx-auto space-y-3">
            {notIncluded.map((item) => (
              <li key={item} className="text-muted-foreground text-center">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
