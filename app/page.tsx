// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style: string;
}

function getBorderColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "border-gray-400",
    blue: "border-blue-400",
    gray: "border-gray-400",
    purple: "border-purple-400",
    navy: "border-blue-900",
    maroon: "border-red-800",
    pink: "border-pink-400",
    teal: "border-teal-400",
  };
  return mapping[color] || mapping["default"];
}

function getBgColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "bg-gray-100",
    blue: "bg-blue-100",
    gray: "bg-gray-100",
    purple: "bg-purple-100",
    navy: "bg-blue-100",
    maroon: "bg-red-100",
    pink: "bg-pink-100",
    teal: "bg-teal-100",
  };
  return mapping[color] || mapping["default"];
}

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    // 50 quotes as before...
    "I wish I could tell you how much I miss you.",
    "My heart still aches for the words left unsaid.",
    "Every moment without you feels like a lifetime.",
    "I regret never telling you I loved you.",
    "Our silence was louder than our love.",
    "The memories of you haunt me every day.",
    "I still wonder what could have been.",
    "Your absence leaves a void in my soul.",
    "Every sunset reminds me of our last goodbye.",
    "I carry the weight of all my unspoken words.",
    "I wish I could go back and say everything.",
    "The pain of our parting still lingers.",
    "You were my first love, and my last regret.",
    "I keep replaying our last moments in my mind.",
    "Sometimes I cry for the love we never had.",
    "My heart is still broken from our goodbye.",
    "Every day, I long to hear your voice again.",
    "I never got to say the things I truly felt.",
    "Missing you is a constant ache in my heart.",
    "The words I left unsent still echo inside me.",
    "I wonder if you ever think of me too.",
    "Loving you was beautiful, even if it hurt.",
    "Our love was a memory that still burns.",
    "I regret every moment we spent apart.",
    "You were the chapter I never could finish.",
    "I wish I had one more chance to hold you.",
    "The pain of your loss is etched in my soul.",
    "Every heartbeat reminds me of our lost love.",
    "I never knew love until I lost you.",
    "My soul still sings the song of our love.",
    "I ache for the days when you were mine.",
    "Your absence is the loudest silence.",
    "I carry the scars of our parting.",
    "I wish our story had a happier ending.",
    "Every memory of you is both sweet and painful.",
    "Our last words were never enough.",
    "The ghost of our love haunts my dreams.",
    "I still dream of the love we could have shared.",
    "I long for the embrace that once healed me.",
    "I regret not fighting harder for our love.",
    "My heart is a battlefield of lost words.",
    "I mourn the love that was never fully lived.",
    "The echoes of our past still whisper to me.",
    "I lost a part of me when you left.",
    "The silence after goodbye is deafening.",
    "I still wait for a love that can never return.",
    "Our unspoken words are my greatest sorrow.",
    "I’m haunted by the memories of our unfinished love.",
    "I wish I had the courage to say it all.",
    "Our love remains, a bittersweet ghost in my heart.",
  ];

  useEffect(() => {
    async function fetchRecentMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        console.error("Error fetching recent memories:", error);
      } else {
        setRecentMemories(data || []);
      }
    }
    fetchRecentMemories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">If Only I Sent This</h1>
          <nav>
            <ul className="flex gap-6">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/memories" className="hover:text-blue-600">Memories</Link></li>
              <li><Link href="/submit" className="hover:text-blue-600">Submit</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {/* Rotating Quote */}
        <section className="mb-10 p-8 bg-white/90 rounded-lg shadow-lg text-center">
          <p className="text-2xl italic text-gray-700">&quot;{quotes[quoteIndex]}&quot;</p>
        </section>

        {/* Recent Memories */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Recent Memories</h2>
          {recentMemories.length > 0 ? (
            recentMemories.map((memory) => (
              <Link key={memory.id} href={`/memories/${memory.id}`} className="block">
                <div className={`shadow-lg rounded-lg p-6 mb-6 transition-transform duration-200 hover:scale-105 
                  ${memory.full_bg ? getBgColor(memory.color) : "bg-white/90"} 
                  border-l-4 ${getBorderColor(memory.color)}`}>
                  <h3 className={`text-2xl font-semibold text-gray-800`}>To: {memory.recipient}</h3>
                  <p className="mt-4 text-gray-700">{memory.message}</p>
                  {memory.sender && <p className="mt-4 italic text-lg text-gray-600">— {memory.sender}</p>}
                  <div className="mt-4 border-t border-gray-300 pt-2 flex flex-wrap text-gray-500 text-sm items-center">
                    <span>Date: {new Date(memory.created_at).toLocaleDateString()}</span>
                    <span className="mx-2">|</span>
                    <span>Day: {new Date(memory.created_at).toLocaleDateString(undefined, { weekday: 'long' })}</span>
                    <span className="mx-2">|</span>
                    <span>Time: {new Date(memory.created_at).toLocaleTimeString()}</span>
                    <span className="mx-2">|</span>
                    <span>Color: {memory.color}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-700">No recent memories found.</p>
          )}
          <div className="text-right mt-4">
            <Link href="/memories" className="text-blue-600 hover:underline">View All Memories &rarr;</Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
