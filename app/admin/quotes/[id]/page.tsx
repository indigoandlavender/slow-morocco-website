"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  // Loading state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [journeyInterest, setJourneyInterest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [language, setLanguage] = useState("English");
  const [budget, setBudget] = useState("");
  const [price, setPrice] = useState("");
  const [requests, setRequests] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("NEW");

  // Styled text input
  const TextInput = ({ label, value, onChange, placeholder = "" }: { 
    label: string; 
    value: string; 
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );

  // Styled number input
  const NumberInput = ({ label, value, onChange }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void;
  }) => (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 border border-border bg-background text-xl font-serif focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );

  // Fetch quote data
  useEffect(() => {
    fetch(`/api/admin/quotes/${clientId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.quote) {
          const q = data.quote;
          setFirstName(q.firstName || "");
          setLastName(q.lastName || "");
          setEmail(q.email || "");
          setPhone(q.phone || "");
          setCountry(q.country || "");
          setJourneyInterest(q.journeyInterest || "");
          setStartDate(q.startDate || "");
          setEndDate(q.endDate || "");
          setStartCity(q.startCity || "");
          setEndCity(q.endCity || "");
          setDays(parseInt(q.days) || 7);
          setTravelers(parseInt(q.travelers) || 2);
          setLanguage(q.language || "English");
          setBudget(q.budget || "");
          setRequests(q.requests || "");
          setNotes(q.notes || "");
          setStatus(q.status || "NEW");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load quote:", err);
        setLoading(false);
      });
  }, [clientId]);

  // ACTION: Update Database
  const handleUpdateDatabase = async () => {
    setSaving(true);
    setMessage("");
    
    const quoteData = {
      firstName, lastName, email, phone, country,
      journeyInterest, startDate, endDate, startCity, endCity,
      days: days.toString(), travelers: travelers.toString(), 
      language, budget, requests, notes, status
    };
    
    try {
      const res = await fetch(`/api/admin/quotes/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteData)
      });
      const data = await res.json();
      setMessage(data.success ? "Quote updated!" : `Error: ${data.error}`);
    } catch (err) {
      setMessage("Failed to save");
    }
    setSaving(false);
  };

  // ACTION: Generate Proposal
  const handleGenerateProposal = async () => {
    setGenerating(true);
    setMessage("");
    
    try {
      console.log("Fetching content library...");
      const contentRes = await fetch("/api/content-library");
      const contentData = await contentRes.json();
      
      console.log("Content library response:", contentData);
      
      if (!contentData.success) {
        setMessage(`Error: ${contentData.error || "Failed to fetch content"}`);
        setGenerating(false);
        return;
      }
      
      if (!contentData.contentBlocks?.length) {
        setMessage("Error: No content blocks found in Content_Library. Please add data to the Content_Library tab in your spreadsheet.");
        setGenerating(false);
        return;
      }
      
      const contentBlocks = contentData.contentBlocks;
      console.log(`Found ${contentBlocks.length} content blocks:`, contentBlocks);
      
      // Find the hero row (Day_Number = 0 or empty, but has heroTitle)
      const heroBlock = contentBlocks.find((block: any) => 
        block.heroTitle && (!block.dayNumber || block.dayNumber === "0" || block.dayNumber === 0)
      ) || contentBlocks[0] || {};
      
      // Get day rows (Day_Number >= 1)
      const dayBlocks = contentBlocks.filter((block: any) => 
        block.dayNumber && parseInt(block.dayNumber) >= 1
      );
      
      console.log("Hero block:", heroBlock);
      console.log("Day blocks:", dayBlocks);
      
      const proposalId = `PRP-${Date.now()}`;
      
      // Build route points for map
      const routePoints: { name: string; coords: [number, number] }[] = [];
      const cityCoords: { [key: string]: [number, number] } = {
        "Marrakech": [-7.9811, 31.6295],
        "Casablanca": [-7.5898, 33.5731],
        "Fes": [-5.0078, 34.0181],
        "Chefchaouen": [-5.2636, 35.1688],
        "Essaouira": [-9.7595, 31.5085],
        "Merzouga": [-4.0133, 31.0802],
        "Ouarzazate": [-6.8936, 30.9189],
        "Tamnougalt": [-6.4667, 30.95],
        "Zagora": [-5.8381, 30.3306],
        "Tinghir": [-5.5328, 31.5147],
        "Dades": [-5.9833, 31.4500],
        "Todra": [-5.5833, 31.5500],
      };
      
      const proposalDays = dayBlocks.map((block: any) => {
        const dayNum = parseInt(block.dayNumber) || 1;
        console.log(`Processing day ${dayNum}:`, block);
        
        // Build route points
        if (block.fromCity && cityCoords[block.fromCity] && !routePoints.some(p => p.name === block.fromCity)) {
          routePoints.push({ name: block.fromCity, coords: cityCoords[block.fromCity] });
        }
        if (block.toCity && cityCoords[block.toCity] && !routePoints.some(p => p.name === block.toCity)) {
          routePoints.push({ name: block.toCity, coords: cityCoords[block.toCity] });
        }
        
        return {
          dayNumber: dayNum,
          date: startDate ? new Date(new Date(startDate).getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "",
          title: block.toCity || block.dayTitle || block.fromCity || `Day ${dayNum}`,
          fromCity: block.fromCity || "",
          toCity: block.toCity || "",
          description: block.description || "",
          imageUrl: block.imageUrl || "",
          durationHours: block.travelTime || "",
          activities: block.activities || "",
          difficultyLevel: block.difficulty || "",
          meals: block.meals || "",
          accommodationName: block.accommodation || "",
        };
      });
      
      // Calculate price
      const totalPrice = parseFloat(price) || 2450;
      const formattedPrice = `€${totalPrice.toLocaleString()} EUR`;
      
      // Get hero content from the hero block
      const proposalData = {
        id: proposalId,
        journeyTitle: heroBlock.heroTitle || "Your Morocco Journey",
        arcDescription: heroBlock.heroBlurb || `A ${proposalDays.length}-day journey exploring Morocco's most captivating corners.`,
        clientName: `${firstName} ${lastName}`.trim(),
        heroImage: heroBlock.heroImageUrl || proposalDays[0]?.imageUrl || "",
        price: price || "2,450",
        days: proposalDays
      };
      
      console.log("Saving proposal data:", proposalData);
      
      // Save to localStorage for immediate viewing
      localStorage.setItem(`proposal-${proposalId}`, JSON.stringify(proposalData));
      
      // Also save to Google Sheets Proposals tab
      try {
        const sheetsPayload = {
          clientId: clientId,
          clientName: `${firstName} ${lastName}`.trim(),
          country: country,
          heroImageUrl: heroBlock.heroImageUrl || proposalDays[0]?.imageUrl || "",
          heroTitle: heroBlock.heroTitle || "Your Morocco Journey",
          heroBlurb: heroBlock.heroBlurb || `A ${proposalDays.length}-day journey exploring Morocco's most captivating corners.`,
          startDate: startDate,
          endDate: endDate,
          days: days,
          nights: days - 1,
          numGuests: travelers,
          totalPrice: totalPrice,
          formattedPrice: formattedPrice,
          routePoints: routePoints,
          daysList: proposalDays,
        };
        
        const saveRes = await fetch("/api/admin/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetsPayload),
        });
        
        const saveData = await saveRes.json();
        if (!saveData.success) {
          console.warn("Failed to save proposal to sheets:", saveData.error);
        } else {
          console.log("Proposal saved to sheets:", saveData.proposalId);
        }
      } catch (sheetsErr) {
        console.warn("Failed to save to sheets:", sheetsErr);
        // Continue anyway - localStorage has the data
      }
      
      console.log("Opening proposal page:", `/proposal/${proposalId}`);
      window.open(`/proposal/${proposalId}`, '_blank');
      setMessage("Proposal generated!");
    } catch (err) {
      console.error("Generate error:", err);
      setMessage(`Failed to generate proposal: ${err}`);
    }
    setGenerating(false);
  };

  // ACTION: Delete
  const handleDelete = async () => {
    if (!confirm("Delete this quote?")) return;
    
    try {
      const res = await fetch(`/api/admin/quotes/${clientId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/quotes");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/quotes" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Link>
            <h1 className="font-serif text-3xl">Quote Details</h1>
            <span className="text-sm text-muted-foreground font-mono">{clientId}</span>
          </div>
          <div className={`text-xs px-3 py-1 rounded ${
            status === "NEW" ? "bg-green-50 text-green-700" :
            status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" :
            status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700" :
            status === "CANCELLED" ? "bg-red-50 text-red-700" :
            "bg-gray-50 text-gray-700"
          }`}>
            {status}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Client Information */}
            <section>
              <h2 className="font-serif text-xl mb-6">Client Information</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <TextInput label="First Name" value={firstName} onChange={setFirstName} />
                <TextInput label="Last Name" value={lastName} onChange={setLastName} />
              </div>
              <div className="mb-6">
                <TextInput label="Email" value={email} onChange={setEmail} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <TextInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 123 4567" />
                <TextInput label="Country" value={country} onChange={setCountry} />
              </div>
            </section>

            {/* Journey Details */}
            <section>
              <h2 className="font-serif text-xl mb-6">Journey Details</h2>
              <div className="mb-6">
                <TextInput label="Journey Interest" value={journeyInterest} onChange={setJourneyInterest} placeholder="e.g., Sahara Desert, Imperial Cities" />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <TextInput label="Start City" value={startCity} onChange={setStartCity} placeholder="e.g., Marrakech" />
                <TextInput label="End City" value={endCity} onChange={setEndCity} placeholder="e.g., Casablanca" />
              </div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <NumberInput label="Days" value={days} onChange={setDays} />
                <NumberInput label="Travelers" value={travelers} onChange={setTravelers} />
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <TextInput label="Budget" value={budget} onChange={setBudget} placeholder="e.g., $2,500 - $4,000" />
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Price (€)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 2450"
                    className="w-full px-4 py-3 border border-border bg-background text-xl font-serif focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SENT">Sent</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Special Requests */}
            <section>
              <h2 className="font-serif text-xl mb-6">Special Requests</h2>
              <textarea
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                rows={4}
                placeholder="Dietary needs, accessibility requirements, special interests..."
                className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors resize-none"
              />
            </section>

            {/* Internal Notes */}
            <section>
              <h2 className="font-serif text-xl mb-6">Internal Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Notes for your reference (not visible to client)..."
                className="w-full px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors resize-none"
              />
            </section>

          </div>

          {/* Right - Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border border-border p-8">
              <h2 className="font-serif text-xl mb-6">Summary</h2>
              
              {/* Client Name */}
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-1">Client</p>
                <p className="font-serif text-2xl">
                  {firstName || lastName ? `${firstName} ${lastName}` : "—"}
                </p>
              </div>

              {/* Journey Info */}
              <div className="space-y-4 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-serif">{days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-serif">{travelers}</span>
                </div>
                {startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start</span>
                    <span className="font-serif">{new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End</span>
                    <span className="font-serif">{new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {(startCity || endCity) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-serif text-right">{startCity}{startCity && endCity ? " → " : ""}{endCity}</span>
                  </div>
                )}
                {journeyInterest && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest</span>
                    <span className="font-serif text-right max-w-[150px]">{journeyInterest}</span>
                  </div>
                )}
                {price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-serif text-xl">€{price}</span>
                  </div>
                )}
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-6 p-3 text-sm ${
                  message.includes("Error") || message.includes("Failed") 
                    ? "bg-red-50 text-red-700" 
                    : "bg-green-50 text-green-700"
                }`}>
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUpdateDatabase}
                  disabled={saving}
                  className="w-full py-4 bg-foreground text-background text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Update Database"}
                </button>
                <button
                  onClick={handleGenerateProposal}
                  disabled={generating}
                  className="w-full py-4 bg-green-700 text-white text-xs tracking-[0.15em] uppercase hover:bg-green-800 disabled:opacity-50 transition-colors"
                >
                  {generating ? "Generating..." : "Generate Proposal"}
                </button>
                <Link
                  href="/admin/quotes/new"
                  className="block w-full py-4 border border-border text-xs tracking-[0.15em] uppercase hover:border-foreground transition-colors text-center"
                >
                  New Quote
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full py-4 text-red-600 text-xs tracking-[0.15em] uppercase hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
