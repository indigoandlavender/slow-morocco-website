"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // TODO: Connect to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Contact Form Section */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left - Title */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground/90 leading-[1.1]">
                SEND
                <br />
                US
                <br />
                A
                <br />
                NOTE.
              </h1>
            </div>

            {/* Right - Form */}
            <div>
              {submitted ? (
                <div className="py-12">
                  <h3 className="font-serif text-2xl mb-4">Thank you.</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We've received your message and will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full border-b border-border bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full border-b border-border bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-b border-border bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-b border-border bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full border-b border-border bg-transparent py-3 text-lg focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
