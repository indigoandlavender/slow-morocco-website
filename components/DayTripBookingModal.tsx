"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Addon {
  id: string;
  name: string;
  description: string;
  priceMAD: number;
  priceEUR: number;
}

interface DayTripBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripSlug: string;
  tripTitle: string;
  basePriceMAD: number;
  basePriceEUR: number;
  addons: Addon[];
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function DayTripBookingModal({
  isOpen,
  onClose,
  tripSlug,
  tripTitle,
  basePriceMAD,
  basePriceEUR,
  addons,
}: DayTripBookingModalProps) {
  const [tripDate, setTripDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1); // 1: details, 2: payment
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Calculate totals
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find((a) => a.id === addonId);
    return sum + (addon ? addon.priceEUR * guests : 0);
  }, 0);

  const addonsTotalMAD = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find((a) => a.id === addonId);
    return sum + (addon ? addon.priceMAD * guests : 0);
  }, 0);

  const totalEUR = basePriceEUR + addonsTotal;
  const totalMAD = basePriceMAD + addonsTotalMAD;

  // Minimum date (48 hours from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Load PayPal SDK
  useEffect(() => {
    if (step === 2 && !paypalLoaded && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu&currency=EUR`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPalButton();
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup if needed
      };
    } else if (step === 2 && paypalLoaded) {
      renderPayPalButton();
    }
  }, [step, paypalLoaded]);

  const renderPayPalButton = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container || !window.paypal) return;

    container.innerHTML = "";

    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `${tripTitle} - ${tripDate} - ${guests} guest(s)`,
                amount: {
                  value: totalEUR.toFixed(2),
                  currency_code: "EUR",
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          handlePaymentSuccess(order.id);
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          alert("Payment failed. Please try again.");
        },
      })
      .render("#paypal-button-container");
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    setIsSubmitting(true);

    try {
      const selectedAddonNames = selectedAddons
        .map((id) => addons.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const response = await fetch("/api/day-trip-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSlug,
          tripTitle,
          tripDate,
          guests,
          basePriceMAD,
          addons: selectedAddonNames,
          addonsPriceMAD: addonsTotalMAD,
          totalMAD,
          totalEUR,
          guestName,
          guestEmail,
          guestPhone,
          pickupLocation,
          notes,
          paypalTransactionId: transactionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingId(result.bookingId);
        setBookingComplete(true);
      } else {
        alert("Booking save failed. Please contact us with your PayPal transaction ID: " + transactionId);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please contact us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const canProceed =
    tripDate && guestName.trim() && guestEmail.trim() && pickupLocation.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">{tripTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {bookingComplete ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-2">Booking Confirmed</h3>
              <p className="text-muted-foreground mb-4">
                Reference: {bookingId}
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                We'll send confirmation details to {guestEmail}
              </p>
              <button
                onClick={onClose}
                className="bg-foreground text-background px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Details */
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  min={minDateStr}
                  className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 48 hours notice required
                </p>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">
                  Number of Guests *
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground bg-white"
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Price is per car (up to 3 guests)
                </p>
              </div>

              {/* Add-ons */}
              {addons.length > 0 && (
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-3">
                    Add to your experience
                  </label>
                  <div className="space-y-3">
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                          selectedAddons.includes(addon.id)
                            ? "border-olive bg-olive/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{addon.name}</span>
                            <span className="text-sm">+€{addon.priceEUR}/person</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {addon.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-4">
                  Your Details
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground"
                  />
                  
                  <input
                    type="email"
                    placeholder="Email *"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground"
                  />
                  
                  <input
                    type="text"
                    placeholder="Pickup Location (hotel/riad name & address) *"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground"
                  />
                  
                  <textarea
                    placeholder="Special requests (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-border px-4 py-3 focus:outline-none focus:border-foreground resize-none"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-sand p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Day tour (private car)</span>
                  <span>€{basePriceEUR}</span>
                </div>
                {selectedAddons.map((addonId) => {
                  const addon = addons.find((a) => a.id === addonId);
                  if (!addon) return null;
                  return (
                    <div key={addonId} className="flex justify-between text-sm">
                      <span>{addon.name} × {guests}</span>
                      <span>€{addon.priceEUR * guests}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-medium pt-2 border-t border-border/50">
                  <span>Total</span>
                  <span>€{totalEUR}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed}
                className={`w-full py-4 text-xs tracking-[0.15em] uppercase transition-colors ${
                  canProceed
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            /* Step 2: Payment */
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                ← Back to details
              </button>

              {/* Summary */}
              <div className="bg-sand p-4">
                <h3 className="font-medium mb-3">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Date:</span> {tripDate}</p>
                  <p><span className="text-muted-foreground">Guests:</span> {guests}</p>
                  <p><span className="text-muted-foreground">Pickup:</span> {pickupLocation}</p>
                  {selectedAddons.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Add-ons:</span>{" "}
                      {selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex justify-between font-medium pt-3 mt-3 border-t border-border/50">
                  <span>Total</span>
                  <span>€{totalEUR}</span>
                </div>
              </div>

              {/* PayPal Button */}
              <div>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Complete your booking with PayPal
                </p>
                <div id="paypal-button-container" className="min-h-[50px]">
                  {!paypalLoaded && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {isSubmitting && (
                <div className="text-center text-sm text-muted-foreground">
                  Processing your booking...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
