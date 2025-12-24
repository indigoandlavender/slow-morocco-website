import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Slow Morocco",
  description: "Privacy Policy for Slow Morocco travel services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Slow Morocco ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website or use our travel planning services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect information about you in a variety of ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Personal data you provide (name, email, phone number)</li>
              <li>Travel preferences and requirements</li>
              <li>Booking and payment information</li>
              <li>Communications you send to us</li>
              <li>Website usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Plan and customize your Morocco journey</li>
              <li>Process bookings and payments</li>
              <li>Communicate with you about your trip</li>
              <li>Send you newsletters (with your consent)</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may share your information with trusted third parties who assist us in 
              operating our website, conducting our business, or servicing you, including 
              hotels, guides, and transport providers in Morocco. We do not sell your 
              personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures 
              to protect your personal information. However, no electronic transmission 
              over the Internet or information storage technology can be guaranteed to 
              be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal information. 
              You may also opt out of marketing communications at any time. To exercise 
              these rights, please contact us at hello@slowmorocco.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:<br />
              Email: hello@slowmorocco.com<br />
              Address: 35 Derb Fhal Zfriti, Marrakech, Morocco
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
