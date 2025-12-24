"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogOut, ArrowRight, Settings, X } from "lucide-react";

interface ClientSession {
  email: string;
  name: string;
  loggedInAt: string;
}

interface Proposal {
  id: string;
  journeyTitle: string;
  clientName: string;
  price?: string;
  days: any[];
  createdAt?: string;
  status?: string;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<ClientSession | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('slow-morocco-client-session');
    if (!sessionData) {
      router.push('/client/login');
      return;
    }
    
    const sessionObj = JSON.parse(sessionData);
    setSession(sessionObj);
    
    // Load client's proposals
    const clientsData = localStorage.getItem('slow-morocco-clients');
    const clients = clientsData ? JSON.parse(clientsData) : {};
    const client = clients[sessionObj.email];
    
    if (client && client.proposals) {
      // Load full proposal data
      const loadedProposals: Proposal[] = [];
      client.proposals.forEach((proposalId: string) => {
        const proposalData = localStorage.getItem(`proposal-${proposalId}`);
        if (proposalData) {
          loadedProposals.push({
            ...JSON.parse(proposalData),
            id: proposalId
          });
        }
      });
      setProposals(loadedProposals);
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('slow-morocco-client-session');
    router.push('/client/login');
  };

  const handleChangePasscode = () => {
    if (newPasscode !== confirmPasscode) {
      setSettingsMessage("Passcodes do not match.");
      return;
    }
    if (newPasscode.length < 4) {
      setSettingsMessage("Passcode must be at least 4 characters.");
      return;
    }
    
    // Update passcode
    const clientsData = localStorage.getItem('slow-morocco-clients');
    const clients = clientsData ? JSON.parse(clientsData) : {};
    
    if (session && clients[session.email]) {
      clients[session.email].passcode = newPasscode;
      localStorage.setItem('slow-morocco-clients', JSON.stringify(clients));
      setSettingsMessage("Passcode updated successfully!");
      setNewPasscode("");
      setConfirmPasscode("");
      setTimeout(() => setShowSettings(false), 1500);
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
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Welcome back
              </p>
              <h1 className="font-serif text-4xl md:text-5xl">
                {session?.name || 'Traveler'}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowSettings(true)}
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Proposals Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10">
            Your Proposals
          </h2>

          {proposals.length === 0 ? (
            <div className="text-center py-20 bg-sand">
              <p className="font-display text-xl italic text-muted-foreground mb-2">
                No proposals yet
              </p>
              <p className="text-sm text-muted-foreground">
                We're working on something special for you.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="group border-b border-border pb-8 last:border-0"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl mb-3">
                        {proposal.journeyTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{proposal.days?.length || 0} days</span>
                        <span className="text-border">•</span>
                        <span className="font-serif">€{proposal.price || '2,450'}</span>
                        <span className="text-muted-foreground/60">per person</span>
                      </div>
                    </div>
                    <Link
                      href={`/proposal/${proposal.id}`}
                      className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase group-hover:gap-4 transition-all"
                    >
                      View Itinerary
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  {proposal.status && (
                    <div className="mt-6">
                      <span className={`text-xs tracking-[0.15em] uppercase px-4 py-2 ${
                        proposal.status === 'approved' 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : proposal.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative bg-background w-full max-w-md mx-4 p-8 shadow-xl">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 hover:opacity-60 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="font-serif text-2xl mb-8">Account Settings</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Email
                </label>
                <p className="font-serif text-lg">{session?.email}</p>
              </div>

              <hr className="border-border" />

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  New Passcode
                </label>
                <input
                  type="password"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-mono tracking-[0.2em]"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Confirm Passcode
                </label>
                <input
                  type="password"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-mono tracking-[0.2em]"
                />
              </div>

              {settingsMessage && (
                <p className={`text-sm ${settingsMessage.includes('success') ? 'text-green-700' : 'text-red-700'}`}>
                  {settingsMessage}
                </p>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleChangePasscode}
                  className="flex-1 bg-foreground text-background px-6 py-4 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Update Passcode
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-4 border border-foreground text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
