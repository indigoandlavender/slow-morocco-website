import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Safety | Slow Morocco",
  description: "Health and safety information for traveling to Morocco.",
};

export default function HealthSafetyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Health & Safety</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Morocco is a safe destination for travelers. Here's what you need to know 
          to stay healthy and safe during your journey.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl mb-4">Before You Travel</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Consult your doctor 4-6 weeks before travel for health advice</li>
              <li>• Ensure routine vaccinations are up to date</li>
              <li>• Consider Hepatitis A and Typhoid vaccinations</li>
              <li>• Bring adequate supplies of any prescription medications</li>
              <li>• Purchase comprehensive travel insurance (required)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Food & Water</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Moroccan cuisine is delicious and generally safe when eaten at reputable 
              establishments. Our recommendations:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Drink bottled water (widely available)</li>
              <li>• Avoid ice in drinks unless at high-end establishments</li>
              <li>• Eat freshly prepared, hot food</li>
              <li>• Wash fruits that you peel yourself</li>
              <li>• Street food is part of the experience—we'll guide you to safe options</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Sun & Heat</h2>
            <p className="text-muted-foreground leading-relaxed">
              Morocco can be hot, especially in summer and in desert regions. Stay 
              hydrated, use sunscreen (SPF 30+), wear a hat, and take breaks in the 
              shade. Our itineraries are designed to avoid the hottest parts of the 
              day during summer months.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Personal Safety</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Morocco is welcoming to tourists. Common sense precautions apply:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Keep valuables secure and out of sight</li>
              <li>• Use hotel safes for passports and extra cash</li>
              <li>• Be aware of your surroundings in crowded areas</li>
              <li>• Our guides know the areas well and will always prioritize your safety</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">For Women Travelers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Women travel safely throughout Morocco. Modest dress is appreciated, 
              especially in traditional areas and religious sites—covering shoulders 
              and knees is recommended. Our female guests consistently report feeling 
              welcome and comfortable, particularly when traveling with our experienced guides.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Medical Facilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              Major cities like Marrakech, Fes, and Casablanca have good private 
              hospitals and clinics. Pharmacies are plentiful and pharmacists are 
              often multilingual. Our 24/7 support means you'll always have help 
              if you need medical assistance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Emergency Numbers</h2>
            <div className="bg-sand p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Police</p>
                  <p className="font-medium">19</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ambulance</p>
                  <p className="font-medium">15</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fire</p>
                  <p className="font-medium">15</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tourist Police (Marrakech)</p>
                  <p className="font-medium">+212 524 38 46 01</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your safety is our priority. Our vehicles are well-maintained, our drivers 
              are experienced professionals, and our guides are trained in first aid. 
              We monitor conditions throughout Morocco and will adjust itineraries if 
              needed to ensure your wellbeing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
