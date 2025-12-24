import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const dynamic = "force-dynamic";

interface TrainingItem {
  Category: string;
  Question: string;
  Answer: string;
  Keywords: string;
  Order: string;
}

interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

// Simple keyword matching to find relevant answers
function findBestMatch(query: string, training: TrainingItem[]): TrainingItem | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  let bestMatch: TrainingItem | null = null;
  let bestScore = 0;

  for (const item of training) {
    let score = 0;
    
    // Check keywords
    if (item.Keywords) {
      const keywords = item.Keywords.toLowerCase().split(",").map(k => k.trim());
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          score += 3; // Higher weight for keyword matches
        }
      }
    }
    
    // Check question similarity
    if (item.Question) {
      const questionWords = item.Question.toLowerCase().split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 2 && questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
          score += 1;
        }
      }
    }
    
    // Check if query contains category
    if (item.Category && queryLower.includes(item.Category.toLowerCase())) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Only return if we have a reasonable match
  return bestScore >= 2 ? bestMatch : null;
}

// Convert row array to objects
function rowsToObjects<T>(rows: any[]): T[] {
  if (!rows || rows.length < 2) return [];
  
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index] || "";
    });
    return obj as T;
  });
}

export async function GET() {
  try {
    const rows = await getSheetData("Chatbot_Training");
    const training = rowsToObjects<TrainingItem>(rows);
    
    // Return training data (for debugging)
    return NextResponse.json({ 
      training: training.sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"))
    });
  } catch (error) {
    console.error("Error fetching chatbot training:", error);
    return NextResponse.json({ training: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message, history }: ChatRequest = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Try to fetch training data
    let training: TrainingItem[] = [];
    try {
      const rows = await getSheetData("Chatbot_Training");
      training = rowsToObjects<TrainingItem>(rows);
    } catch (e) {
      console.warn("Chatbot_Training tab not found, using defaults");
    }
    
    // If no training data, use hardcoded defaults
    if (training.length === 0) {
      training = getDefaultTraining();
    }
    
    // Get greeting item
    const greetingItem = training.find(t => t.Category?.toLowerCase() === "greeting");
    
    // Check for greeting
    const greetingWords = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "salaam", "bonjour"];
    const isGreeting = greetingWords.some(g => message.toLowerCase().trim().startsWith(g));
    
    if (isGreeting && greetingItem) {
      return NextResponse.json({ 
        response: greetingItem.Answer,
        category: "greeting"
      });
    }

    // Find best matching answer
    const match = findBestMatch(message, training.filter(t => t.Category?.toLowerCase() !== "system"));
    
    if (match) {
      return NextResponse.json({ 
        response: match.Answer,
        category: match.Category,
        matched_question: match.Question
      });
    }

    // Default fallback response
    const fallbackItem = training.find(t => t.Category?.toLowerCase() === "fallback");
    const fallbackResponse = fallbackItem?.Answer || 
      "I'd love to help you plan your Morocco journey. For specific questions about itineraries, pricing, or bookings, please reach out to us at hello@slowmorocco.com or use our Plan Your Trip form. What else would you like to know about traveling with us?";

    return NextResponse.json({ 
      response: fallbackResponse,
      category: "fallback"
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ 
      response: "I apologize, but I'm having trouble right now. Please try again or email us at hello@slowmorocco.com",
      error: true 
    }, { status: 500 });
  }
}

// Default training data if Chatbot_Training tab doesn't exist yet
function getDefaultTraining(): TrainingItem[] {
  return [
    {
      Category: "greeting",
      Question: "Hello",
      Answer: "Hello. Ask me anything about Morocco or our journeys.",
      Keywords: "hello,hi,hey,bonjour,salaam",
      Order: "1"
    },
    {
      Category: "fallback",
      Question: "I don't understand",
      Answer: "I don't have an answer for that. Email us at hello@slowmorocco.com or use the Plan Your Trip form.",
      Keywords: "",
      Order: "999"
    },
    {
      Category: "journeys",
      Question: "What journeys do you offer?",
      Answer: "Private journeys from 3 to 14 days. Sahara, Imperial Cities, coast, mountains - depends what you're after. Everything's customizable.",
      Keywords: "journey,journeys,tour,tours,itinerary,trip,trips,routes,options",
      Order: "10"
    },
    {
      Category: "prices",
      Question: "How much do your journeys cost?",
      Answer: "Depends on duration and accommodation level. Roughly: 3 days from €1,200, 12 days around €4,500 - for two guests. Includes transport, accommodation, guides, most meals. Use Plan Your Trip for a real quote.",
      Keywords: "price,cost,how much,expensive,budget,euro,money,rate",
      Order: "11"
    },
    {
      Category: "included",
      Question: "What's included in your journeys?",
      Answer: "Private 4x4 with driver. Handpicked riads and camps. Local guides. Breakfasts, most dinners. Not included: flights, insurance, personal expenses.",
      Keywords: "include,included,what's in,cover,meals,hotel,transport,guide",
      Order: "12"
    },
    {
      Category: "booking",
      Question: "How do I book?",
      Answer: "Fill out the Plan Your Trip form. We send a proposal within 48 hours. 30% deposit holds your dates, balance due 60 days before.",
      Keywords: "book,booking,reserve,reservation,how to,start,begin,deposit,payment",
      Order: "13"
    },
    {
      Category: "sahara",
      Question: "Tell me about the Sahara experience",
      Answer: "Erg Chebbi dunes near Merzouga. Camel ride to camp, dinner under stars, sunrise over the dunes. Most guests say it's the highlight.",
      Keywords: "sahara,desert,sand,dunes,merzouga,erg chebbi,camel,camp",
      Order: "14"
    },
    {
      Category: "best_time",
      Question: "When is the best time to visit Morocco?",
      Answer: "March-May and September-November are ideal. Summer is hot inland. Winter is mild on the coast, cold in the mountains.",
      Keywords: "when,best time,season,weather,month,hot,cold,winter,summer,spring,fall",
      Order: "15"
    },
    {
      Category: "group_size",
      Question: "What size groups do you work with?",
      Answer: "Private journeys only. Usually 2-8 people. Your own vehicle, driver, guide. Not group tourism.",
      Keywords: "group,size,people,couple,family,friends,private,solo,alone",
      Order: "16"
    },
    {
      Category: "customize",
      Question: "Can I customize my journey?",
      Answer: "Yes. Extra nights, different cities, add activities, skip things - we build around what you want.",
      Keywords: "customize,custom,change,modify,flexible,adjust,personal,tailor",
      Order: "17"
    },
    {
      Category: "contact",
      Question: "How can I contact you?",
      Answer: "Plan Your Trip form or hello@slowmorocco.com. WhatsApp: +212 6 18 07 04 50.",
      Keywords: "contact,email,phone,whatsapp,reach,talk,call",
      Order: "18"
    }
  ];
}
