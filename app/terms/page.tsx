import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Slow Morocco",
  description: "Terms of Service for Slow Morocco travel services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Slow Morocco's website and services, you agree to be 
              bound by these Terms of Service. If you disagree with any part of these terms, 
              you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Our Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Slow Morocco provides bespoke travel planning and concierge services for 
              private journeys through Morocco. We act as intermediaries between you and 
              various service providers including accommodations, guides, and transport services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Booking and Payment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To secure your booking:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>A deposit of 30% is required upon booking confirmation</li>
              <li>Full payment is due 45 days before your journey begins</li>
              <li>Payments can be made via bank transfer or credit card</li>
              <li>All prices are quoted in USD unless otherwise specified</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Changes and Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We understand travel plans can change. We will do our best to accommodate 
              modifications to your itinerary, subject to availability and any additional 
              costs from our service providers. Please notify us of any changes as soon as possible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Traveler Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a traveler, you are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Ensuring you have valid travel documents (passport, visa if required)</li>
              <li>Obtaining appropriate travel insurance</li>
              <li>Informing us of any health conditions or dietary requirements</li>
              <li>Respecting local customs and laws in Morocco</li>
              <li>Arriving on time for scheduled activities and transfers</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we take great care in planning your journey, Slow Morocco cannot be 
              held liable for circumstances beyond our control, including but not limited 
              to: natural disasters, political unrest, flight cancellations, or actions 
              of third-party service providers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, images, and itineraries, is the 
              property of Slow Morocco and is protected by copyright laws. You may not 
              reproduce, distribute, or use our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws 
              of Morocco. Any disputes arising from these terms will be resolved in the 
              courts of Marrakech, Morocco.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at:<br />
              Email: hello@slowmorocco.com<br />
              Address: 35 Derb Fhal Zfriti, Marrakech, Morocco
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
