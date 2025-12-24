import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function GuidesPage() {
  const guides = [
    {
      title: "FAQ",
      href: "/faq",
      description: "Common questions about traveling with us",
    },
    {
      title: "What's Included",
      href: "/whats-included",
      description: "Everything covered in your journey",
    },
    {
      title: "Payment & Booking",
      href: "/payment-booking",
      description: "How our booking process works",
    },
    {
      title: "Cancellation Policy",
      href: "/cancellation-policy",
      description: "Our flexible cancellation terms",
    },
    {
      title: "Visa Information",
      href: "/visa-info",
      description: "Entry requirements for Morocco",
    },
    {
      title: "Health & Safety",
      href: "/health-safety",
      description: "Staying healthy while traveling",
    },
    {
      title: "Travel Insurance",
      href: "/travel-insurance",
      description: "Why we recommend travel insurance",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-6 lg:px-16 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl mb-4">
                Travel Guides
              </h1>
              <p className="text-muted-foreground text-lg">
                Everything you need to know before your journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="block p-6 bg-white border border-border hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-serif text-xl mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center bg-muted p-8 md:p-12">
              <h2 className="font-serif text-2xl mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-6">
                We're here to help. Reach out anytime.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
