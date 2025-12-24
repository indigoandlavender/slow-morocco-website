"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Quote {
  Client_ID: string;
  First_Name: string;
  Last_Name: string;
  Email: string;
  WhatsApp_Country_Code: string;
  WhatsApp_Number: string;
  Journey_Interest: string;
  Start_Date: string;
  Days: string;
  Number_Travelers: string;
  Budget: string;
  Status: string;
  Created_Date: string;
  Language: string;
  Requests: string;
  Country: string;
}

type SortField = "Client_ID" | "Name" | "Country" | "Email" | "Journey_Interest" | "Start_Date" | "Number_Travelers" | "Status" | "Created_Date";
type SortDirection = "asc" | "desc";

const statusOptions = ["ALL", "NEW", "IN_PROGRESS", "ITINERARY_READY", "PRICED", "SENT_TO_CLIENT", "CONFIRMED", "CANCELLED"];

// Clean, minimal SVG icons (Anthropic-style)
const Icons = {
  edit: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2M2 14l1-4L11.5 1.5l2 2L5 12l-4 1z" />
    </svg>
  ),
  duplicate: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1" />
      <path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
    </svg>
  ),
  delete: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  ),
  sortAsc: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 3l4 6H2l4-6z" />
    </svg>
  ),
  sortDesc: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 9l4-6H2l4 6z" />
    </svg>
  ),
  sort: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.3">
      <path d="M6 2l3 4H3l3-4zM6 10l3-4H3l3 4z" />
    </svg>
  ),
};

const statusColors: { [key: string]: string } = {
  NEW: "bg-green-50 text-green-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  ITINERARY_READY: "bg-purple-50 text-purple-700",
  PRICED: "bg-yellow-50 text-yellow-700",
  SENT_TO_CLIENT: "bg-orange-50 text-orange-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("Created_Date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((data) => {
        setQuotes(data.quotes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter and sort quotes
  const filteredAndSortedQuotes = useMemo(() => {
    let result = [...quotes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.Client_ID?.toLowerCase().includes(query) ||
          q.First_Name?.toLowerCase().includes(query) ||
          q.Last_Name?.toLowerCase().includes(query) ||
          q.Email?.toLowerCase().includes(query) ||
          q.Journey_Interest?.toLowerCase().includes(query) ||
          q.Country?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((q) => q.Status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "Client_ID":
          aVal = a.Client_ID || "";
          bVal = b.Client_ID || "";
          break;
        case "Name":
          aVal = `${a.First_Name} ${a.Last_Name}`.toLowerCase();
          bVal = `${b.First_Name} ${b.Last_Name}`.toLowerCase();
          break;
        case "Country":
          aVal = a.Country?.toLowerCase() || "";
          bVal = b.Country?.toLowerCase() || "";
          break;
        case "Email":
          aVal = a.Email?.toLowerCase() || "";
          bVal = b.Email?.toLowerCase() || "";
          break;
        case "Journey_Interest":
          aVal = a.Journey_Interest?.toLowerCase() || "";
          bVal = b.Journey_Interest?.toLowerCase() || "";
          break;
        case "Start_Date":
          aVal = a.Start_Date ? new Date(a.Start_Date).getTime() : 0;
          bVal = b.Start_Date ? new Date(b.Start_Date).getTime() : 0;
          break;
        case "Number_Travelers":
          aVal = parseInt(a.Number_Travelers) || 0;
          bVal = parseInt(b.Number_Travelers) || 0;
          break;
        case "Status":
          aVal = a.Status || "";
          bVal = b.Status || "";
          break;
        case "Created_Date":
          aVal = a.Created_Date ? new Date(a.Created_Date).getTime() : 0;
          bVal = b.Created_Date ? new Date(b.Created_Date).getTime() : 0;
          break;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [quotes, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left p-4 text-xs uppercase tracking-wide text-muted-foreground font-medium cursor-pointer hover:text-foreground select-none"
    >
      <div className="flex items-center gap-1">
        {children}
        <span className="ml-1">
          {sortField === field
            ? sortDirection === "asc"
              ? Icons.sortAsc
              : Icons.sortDesc
            : Icons.sort}
        </span>
      </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar - Top */}
      <div className="border-b border-border bg-muted/30 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
              <input
                type="text"
                placeholder="Search by name, email, client ID, or journey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-border bg-background text-sm focus:outline-none focus:border-foreground"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3 3" />
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground min-w-[160px]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Status" : status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">All Quotes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedQuotes.length} of {quotes.length} quotes
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs uppercase tracking-wide border border-border px-4 py-2 hover:border-foreground transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No quotes found.
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <SortHeader field="Client_ID">Client ID</SortHeader>
                    <SortHeader field="Name">Name</SortHeader>
                    <SortHeader field="Email">Email</SortHeader>
                    <SortHeader field="Journey_Interest">Journey</SortHeader>
                    <SortHeader field="Start_Date">Date</SortHeader>
                    <SortHeader field="Status">Status</SortHeader>
                    <th className="text-right p-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {filteredAndSortedQuotes.map((quote) => (
                    <tr key={quote.Client_ID} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-mono">{quote.Client_ID}</td>
                      <td className="p-4 text-sm">
                        {quote.First_Name} {quote.Last_Name}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{quote.Email}</td>
                      <td className="p-4 text-sm">{quote.Journey_Interest || "Custom"}</td>
                      <td className="p-4 text-sm">{formatDate(quote.Start_Date)}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[quote.Status] || "bg-gray-100 text-gray-700"}`}>
                          {quote.Status?.replace(/_/g, " ") || "NEW"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/quotes/${quote.Client_ID}`}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                            title="View/Edit"
                          >
                            {Icons.edit}
                          </Link>
                          <button
                            onClick={() => {
                              alert(`Duplicate ${quote.Client_ID}`);
                            }}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                            title="Duplicate"
                          >
                            {Icons.duplicate}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${quote.Client_ID}?`)) {
                                alert(`Delete ${quote.Client_ID}`);
                              }
                            }}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            {Icons.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
