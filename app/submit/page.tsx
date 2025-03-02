"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const colorOptions = [
  { value: "default", label: "Default" },
  { value: "blue", label: "Blue" },
  { value: "gray", label: "Gray" },
  { value: "purple", label: "Purple" },
  { value: "navy", label: "Navy" },
  { value: "maroon", label: "Maroon" },
  { value: "pink", label: "Pink" },
  { value: "teal", label: "Teal" },
];

const specialEffectOptions = [
  { value: "", label: "None" },
  { value: "bleeding", label: "Bleeding Text Effect" },
  { value: "broken", label: "Broken Words Effect" },
  { value: "neon", label: "Heart Glow" },
  { value: "handwritten", label: "Handwritten Text Effect" },
];

export default function Submit() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [color, setColor] = useState("default");
  const [specialEffect, setSpecialEffect] = useState("");
  const [fullBg, setFullBg] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    const status = "pending";
    // Save letter_style as default (unused) and store the special effect in animation
    const { error } = await supabase
      .from("memories")
      .insert([{ recipient, message, sender, status, color, full_bg: fullBg, letter_style: "default", animation: specialEffect }]);

    if (error) {
      setError("Error submitting your memory.");
      console.error(error);
    } else {
      setSubmitted(true);
      setRecipient("");
      setMessage("");
      setSender("");
      setColor("default");
      setSpecialEffect("");
      setFullBg(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Submit a Memory</h1>
          <hr className="my-4 border-gray-300" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/memories" className="hover:text-blue-600">Memories</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {submitted ? (
          <div className="bg-gradient-to-r from-green-300 to-green-500 text-white p-8 rounded-lg mb-6 text-center">
            Thank you for your submission! Your memory is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 p-8 rounded-lg shadow-lg">
            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

            <div>
              <label className="block font-medium text-gray-700">Recipient&apos;s Name (required):</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Message (required):</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Your Name (optional):</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Select a Color for Your Message (optional):</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Do you want any special effect?</label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
              >
                {specialEffectOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                id="fullBg"
                className="mr-2"
              />
              <label htmlFor="fullBg" className="font-medium text-gray-700">
                Apply color to full card background
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-colors duration-200"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
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
