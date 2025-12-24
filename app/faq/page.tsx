import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking 3-6 months in advance, especially for travel during peak seasons (March-May, September-November). However, we can sometimes accommodate last-minute requests depending on availability.",
    },
    {
      question: "Are your journeys private or group tours?",
      answer:
        "All our journeys are completely private. We don't do group tours. Your journey is designed specifically for you and travels with you alone (or your chosen companions).",
    },
    {
      question: "What's included in the price?",
      answer:
        "Each journey includes accommodations, private transportation, an expert guide, most meals, and all activities mentioned in your itinerary. International flights and personal expenses are not included.",
    },
    {
      question: "Can I customize a journey?",
      answer:
        "Absolutely. Most of our journeys are fully customized. Our featured journeys serve as inspiration, but we'll design something unique based on your interests, pace, and preferences.",
    },
    {
      question: "Do I need a visa to visit Morocco?",
      answer:
        "Citizens of the US, Canada, UK, EU, and many other countries can visit Morocco visa-free for up to 90 days. Check our Visa Information page for details specific to your nationality.",
    },
    {
      question: "Is Morocco safe for travelers?",
      answer:
        "Yes, Morocco is generally very safe for travelers. We work with experienced guides who know the country well and prioritize your safety and comfort throughout your journey.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "We offer flexible cancellation terms. Full details are available on our Cancellation Policy page, but in short: we understand that plans change and try to be as accommodating as possible.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes. We require a deposit to secure your booking, with the balance due 60 days before departure. We can also arrange custom payment schedules for longer or more complex journeys.",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-6 lg:px-16 py-16 md:py-24 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-8">
                <h3 className="font-serif text-xl mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-muted p-8 md:p-12">
            <h2 className="font-serif text-2xl mb-4">
              Don't See Your Question?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're happy to answer any questions you have.
            </p>
            <a href="/contact" className="btn-primary">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
