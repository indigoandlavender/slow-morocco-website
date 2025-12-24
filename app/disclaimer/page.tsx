import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Slow Morocco",
  description: "Disclaimer for Slow Morocco travel services.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Disclaimer</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl mb-4">Website Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information provided on the Slow Morocco website is for general 
              informational purposes only. While we strive to keep the information 
              up to date and accurate, we make no representations or warranties of 
              any kind, express or implied, about the completeness, accuracy, 
              reliability, or availability of the website or the information contained on it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Travel Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              Travel conditions, visa requirements, health advisories, and local regulations 
              can change without notice. It is your responsibility to verify current 
              requirements with official sources before traveling. Slow Morocco is not 
              responsible for any consequences arising from reliance on outdated information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services involve arrangements with third-party providers including hotels, 
              restaurants, guides, and transport operators. While we carefully select our 
              partners, we cannot guarantee the performance or conduct of these independent 
              service providers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Photography and Images</h2>
            <p className="text-muted-foreground leading-relaxed">
              Photographs and images on this website are for illustrative purposes only. 
              Actual accommodations, locations, and experiences may vary from those depicted. 
              We make every effort to accurately represent our offerings, but seasonal 
              variations and renovations can affect appearances.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Pricing</h2>
            <p className="text-muted-foreground leading-relaxed">
              All prices displayed are subject to change and are not guaranteed until a 
              booking is confirmed. Prices may vary based on season, availability, group 
              size, and specific requirements. A detailed quote will be provided before 
              any booking is confirmed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Health and Safety</h2>
            <p className="text-muted-foreground leading-relaxed">
              Travel involves inherent risks. We recommend consulting with your healthcare 
              provider before traveling and obtaining comprehensive travel insurance. 
              Slow Morocco is not liable for any illness, injury, or loss that may occur 
              during your journey.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">External Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to external websites. We have no control over 
              the content, privacy policies, or practices of these third-party sites and 
              assume no responsibility for them.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Slow Morocco be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising out of or related to 
              your use of our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Disclaimer, please contact us at:<br />
              Email: hello@slowmorocco.com<br />
              Address: 35 Derb Fhal Zfriti, Marrakech, Morocco
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
