"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/client/dashboard';
  
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check credentials from localStorage (in production, this would be an API call)
      const clientsData = localStorage.getItem('slow-morocco-clients');
      const clients = clientsData ? JSON.parse(clientsData) : {};
      
      const client = clients[email.toLowerCase()];
      
      if (!client) {
        setError("No account found with this email address.");
        setLoading(false);
        return;
      }
      
      if (client.passcode !== passcode) {
        setError("Incorrect passcode. Please try again.");
        setLoading(false);
        return;
      }
      
      // Set session
      localStorage.setItem('slow-morocco-client-session', JSON.stringify({
        email: email.toLowerCase(),
        name: client.name,
        loggedInAt: new Date().toISOString()
      }));
      
      // Redirect
      router.push(redirectTo);
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-b border-border bg-transparent py-3 font-serif text-lg focus:outline-none focus:border-foreground transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Passcode
        </label>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          required
          className="w-full border-b border-border bg-transparent py-3 font-mono text-lg tracking-[0.3em] focus:outline-none focus:border-foreground transition-colors"
          placeholder="••••••"
        />
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground leading-relaxed">
        Your passcode was sent to you via email when your proposal was created.
      </p>
    </form>
  );
}

export default function ClientLoginPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-muted">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] font-light mb-6">
            C L I E N T
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-[0.3em] font-light mb-8">
            P O R T A L
          </h2>
          <p className="font-display text-lg md:text-xl text-muted-foreground italic">
            Access your personalized travel proposals
          </p>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-md">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  );
}
