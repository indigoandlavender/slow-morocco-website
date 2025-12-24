"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  variant?: "default" | "minimal" | "footer";
  className?: string;
}

export default function NewsletterSignup({
  variant = "default",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  // Minimal variant - inline input + button
  if (variant === "minimal") {
    return (
      <div className={className}>
        {status === "success" ? (
          <p className="text-olive text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-olive"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 text-sm bg-olive text-white rounded hover:bg-olive/90 disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-600 text-xs mt-1">{message}</p>
        )}
      </div>
    );
  }

  // Footer variant - styled for footer placement
  if (variant === "footer") {
    return (
      <div className={className}>
        {status === "success" ? (
          <p className="text-olive">{message}</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/80 border border-stone-200 rounded text-sm focus:outline-none focus:border-olive"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-olive text-white text-sm font-medium rounded hover:bg-olive/90 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Joining..." : "Join"}
              </button>
            </form>
            <p className="text-xs text-stone-500 mt-2">
              Occasional updates. Unsubscribe anytime.
            </p>
          </>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm mt-2">{message}</p>
        )}
      </div>
    );
  }

  // Default variant - full form with label
  return (
    <div className={className}>
      <h3 className="font-serif text-lg mb-3">Stay in Touch</h3>
      {status === "success" ? (
        <p className="text-olive">{message}</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="newsletter-email" className="block text-sm text-stone-600 mb-1">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-olive"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 bg-olive text-white font-medium rounded hover:bg-olive/90 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : "Subscribe"}
            </button>
          </form>
          <p className="text-xs text-stone-500 mt-3">
            Occasional updates. Unsubscribe anytime.
          </p>
        </>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
