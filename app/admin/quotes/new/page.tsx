"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface QuoteData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  journeyInterest: string;
  startDate: string;
  days: number;
  travelers: number;
  language: string;
  budget: string;
  requests: string;
  notes: string;
}

function BuildQuoteContent() {
  const searchParams = useSearchParams();
  
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [clientId, setClientId] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  
  // Client feedback from revision request
  const [clientFeedback, setClientFeedback] = useState("");
  
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
  
  // Status
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  
  // Check for feedback from URL params
  useEffect(() => {
    const feedback = searchParams.get('feedback');
    if (feedback) {
      setClientFeedback(decodeURIComponent(feedback));
    }
  }, [searchParams]);

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

  // Search for existing quotes
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    
    try {
      const res = await fetch("/api/admin/quotes");
      const data = await res.json();
      
      if (data.success && data.quotes) {
        const query = searchQuery.toLowerCase();
        const results = data.quotes.filter((q: any) =>
          q.Client_ID?.toLowerCase().includes(query) ||
          q.First_Name?.toLowerCase().includes(query) ||
          q.Last_Name?.toLowerCase().includes(query) ||
          q.Email?.toLowerCase().includes(query)
        );
        setSearchResults(results.slice(0, 5));
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setSearching(false);
  };

  // Load selected quote
  const loadQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${id}`);
      const data = await res.json();
      
      if (data.success && data.quote) {
        const q = data.quote;
        setClientId(q.clientId);
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
        setIsExisting(true);
        setSearchResults([]);
        setSearchQuery("");
        setMessage(`Loaded: ${q.firstName} ${q.lastName}`);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  // ACTION: Update Database
  const handleUpdateDatabase = async () => {
    setSaving(true);
    setMessage("");
    
    const quoteData = {
      firstName, lastName, email, phone, country,
      journeyInterest, startDate, endDate, startCity, endCity,
      days: days.toString(), travelers: travelers.toString(), 
      language, budget, requests, notes
    };
    
    try {
      if (isExisting && clientId) {
        const res = await fetch(`/api/admin/quotes/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteData)
        });
        const data = await res.json();
        setMessage(data.success ? "Quote updated!" : `Error: ${data.error}`);
      } else {
        const res = await fetch("/api/admin/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteData)
        });
        const data = await res.json();
        if (data.success) {
          setClientId(data.clientId);
          setIsExisting(true);
          setMessage(`Quote created! ID: ${data.clientId}`);
        } else {
          setMessage(`Error: ${data.error}`);
        }
      }
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
      
      const proposalId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const proposalDays = dayBlocks.map((block: any) => {
        const dayNum = parseInt(block.dayNumber) || 1;
        console.log(`Processing day ${dayNum}:`, block);
        return {
          dayNumber: dayNum,
          title: block.toCity || block.dayTitle || block.fromCity || `Day ${dayNum}`,
          fromCity: block.fromCity || "",
          toCity: block.toCity || "",
          description: block.description || "",
          imageUrl: block.imageUrl || "",
          // Additional metadata
          durationHours: block.durationHours || "",
          difficultyLevel: block.difficultyLevel || "",
          activities: block.activities || "",
          accommodationType: block.accommodationType || "",
          meals: block.meals || "",
          highlights: block.highlights || "",
        };
      });
      
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
      localStorage.setItem(`proposal-${proposalId}`, JSON.stringify(proposalData));
      
      // Open in EDIT mode for admin
      console.log("Opening proposal page in edit mode:", `/proposal/${proposalId}?edit=true`);
      window.open(`/proposal/${proposalId}?edit=true`, '_blank');
      setMessage("Proposal generated!");
    } catch (err) {
      console.error("Generate error:", err);
      setMessage(`Failed to generate proposal: ${err}`);
    }
    setGenerating(false);
  };

  // ACTION: New Proposal
  const handleNewProposal = () => {
    if (confirm("Clear form and start fresh?")) {
      setClientId("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setJourneyInterest("");
      setStartDate("");
      setEndDate("");
      setStartCity("");
      setEndCity("");
      setDays(7);
      setTravelers(2);
      setLanguage("English");
      setBudget("");
      setRequests("");
      setNotes("");
      setIsExisting(false);
      setMessage("");
    }
  };

  // ACTION: Delete
  const handleDelete = async () => {
    if (!isExisting || !clientId) {
      setMessage("No saved quote to delete");
      return;
    }
    if (!confirm("Delete this quote?")) return;
    
    try {
      const res = await fetch(`/api/admin/quotes/${clientId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        handleNewProposal();
        setMessage("Quote deleted");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/quotes" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Link>
            <h1 className="font-serif text-3xl">Build a Quote</h1>
            {isExisting && clientId && (
              <span className="text-sm text-muted-foreground font-mono">{clientId}</span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Search Existing */}
            <section>
              <h2 className="font-serif text-xl mb-6">Find Existing Quote</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by Client ID, Name, or Email..."
                  className="flex-1 px-4 py-3 border border-border bg-background text-lg focus:outline-none focus:border-foreground transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6 py-3 bg-foreground text-background text-sm tracking-wide uppercase hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-4 border border-border divide-y divide-border">
                  {searchResults.map((result) => (
                    <button
                      key={result.Client_ID}
                      onClick={() => loadQuote(result.Client_ID)}
                      className="w-full px-4 py-4 text-left hover:bg-muted/50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <span className="font-serif">{result.First_Name} {result.Last_Name}</span>
                        <span className="text-muted-foreground ml-3 text-sm">{result.Email}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{result.Client_ID}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Client Feedback Banner - shown when revision requested */}
            {clientFeedback && (
              <section className="bg-amber-50 border border-amber-200 p-6 mb-8">
                <h3 className="font-serif text-lg mb-2 text-amber-900">📝 Client Revision Request</h3>
                <p className="text-amber-800 whitespace-pre-wrap">{clientFeedback}</p>
                <button
                  onClick={() => setClientFeedback("")}
                  className="mt-4 text-xs tracking-[0.1em] uppercase text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Dismiss
                </button>
              </section>
            )}

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
              <div className="grid grid-cols-2 gap-6">
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
                <button
                  onClick={handleNewProposal}
                  className="w-full py-4 border border-border text-xs tracking-[0.15em] uppercase hover:border-foreground transition-colors"
                >
                  New Proposal
                </button>
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

export default function BuildQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    }>
      <BuildQuoteContent />
    </Suspense>
  );
}
