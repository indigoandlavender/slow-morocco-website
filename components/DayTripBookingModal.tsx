"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

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
  const [step, setStep] = useState(1);
  const [tripDate, setTripDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
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

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBookingComplete(false);
    }
  }, [isOpen]);

  // Load PayPal SDK
  useEffect(() => {
    if (step === 4 && !paypalLoaded && typeof window !== "undefined") {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        setPaypalLoaded(true);
        setTimeout(renderPayPalButton, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu&currency=EUR`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPalButton();
      };
      document.body.appendChild(script);
    } else if (step === 4 && paypalLoaded) {
      setTimeout(renderPayPalButton, 100);
    }
  }, [step, paypalLoaded]);

  const renderPayPalButton = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container || !window.paypal) return;

    container.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: 'black',
          shape: 'rect',
          label: 'pay',
          height: 50,
        },
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
        setStep(5);
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

  const canProceedStep1 = tripDate && guests;
  const canProceedStep2 = true;
  const canProceedStep3 = guestName.trim() && guestEmail.trim() && pickupLocation.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:opacity-60 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 border border-foreground rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Booking Confirmed
            </p>
            <h2 className="font-serif text-2xl mb-2">{tripTitle}</h2>
            <p className="text-muted-foreground mb-6">{tripDate}</p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference: {bookingId}<br />
              Confirmation sent to {guestEmail}
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-foreground text-background text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        )}

        {/* Step 1: Date & Guests */}
        {step === 1 && (
          <div className="p-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Step 1 of 4
            </p>
            <h2 className="font-serif text-2xl mb-8">{tripTitle}</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-3">
                  Date
                </label>
                <input
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  min={minDateStr}
                  className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-3">
                  Guests
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-3 border text-sm transition-colors ${
                        guests === num
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 hover:border-foreground"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Price is per car, up to 3 guests
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-foreground/10 flex justify-between items-center">
              <div>
                <p className="text-2xl font-serif">€{basePriceEUR}</p>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-opacity ${
                  canProceedStep1 ? "hover:opacity-60" : "opacity-30 cursor-not-allowed"
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add-ons */}
        {step === 2 && (
          <div className="p-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Step 2 of 4
            </p>
            <h2 className="font-serif text-2xl mb-8">Enhance Your Day</h2>

            {addons.length > 0 ? (
              <div className="space-y-4">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full p-5 border text-left transition-colors ${
                      selectedAddons.includes(addon.id)
                        ? "border-foreground"
                        : "border-foreground/20 hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium mb-1">{addon.name}</p>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">+€{addon.priceEUR}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No add-ons available for this tour.</p>
            )}

            <div className="mt-10 pt-6 border-t border-foreground/10 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-right">
                <p className="text-2xl font-serif">€{totalEUR}</p>
              </div>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="p-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Step 3 of 4
            </p>
            <h2 className="font-serif text-2xl mb-8">Your Details</h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Full name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
              />
              <input
                type="text"
                placeholder="Pickup location (hotel/riad name)"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent"
              />
              <textarea
                placeholder="Special requests (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border-b border-foreground/20 pb-3 focus:outline-none focus:border-foreground bg-transparent resize-none"
              />
            </div>

            <div className="mt-10 pt-6 border-t border-foreground/10 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-opacity ${
                  canProceedStep3 ? "hover:opacity-60" : "opacity-30 cursor-not-allowed"
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="p-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Step 4 of 4
            </p>
            <h2 className="font-serif text-2xl mb-8">Payment</h2>

            {/* Summary */}
            <div className="mb-8 pb-6 border-b border-foreground/10">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{tripTitle}</span>
                  <span>€{basePriceEUR}</span>
                </div>
                {selectedAddons.map((addonId) => {
                  const addon = addons.find((a) => a.id === addonId);
                  if (!addon) return null;
                  return (
                    <div key={addonId} className="flex justify-between">
                      <span className="text-muted-foreground">{addon.name} × {guests}</span>
                      <span>€{addon.priceEUR * guests}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-foreground/10">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl">€{totalEUR}</span>
              </div>
            </div>

            {/* PayPal Button */}
            <div id="paypal-button-container" className="min-h-[50px]">
              {!paypalLoaded && (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border border-foreground/20 border-t-foreground rounded-full animate-spin" />
                </div>
              )}
            </div>

            {isSubmitting && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Processing...
              </p>
            )}

            <button
              onClick={() => setStep(3)}
              className="mt-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
