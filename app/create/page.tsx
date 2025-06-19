'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreateRoadmap() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          userId: user?.uid
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/roadmap/${data.roadmap.id}`);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-2 sm:px-4" style={{ background: "#0B0B0B" }}>
      <div
        className="w-full max-w-xs sm:max-w-md md:max-w-2xl rounded-xl shadow-lg p-4 sm:p-8"
        style={{
          background: "#121212", // Charcoal Black
        }}
      >
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8"
          style={{ color: "#A259FF" }} // Vivid Purple
        >
          Learning Roadmap Generator
        </h1>

        <p
          className="mb-4 sm:mb-8 text-center text-sm sm:text-base"
          style={{ color: "#A259FF" }}
        >
          Enter any topic below and we'll create a personalized learning roadmap with weekly tasks to help you master it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="topic"
              className="text-xs sm:text-sm font-medium mb-1"
              style={{ color: "#A259FF" }}
            >
              What would you like to learn?
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, Web Development, Digital Marketing..."
              className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 text-[#F0E6FF] text-xs sm:text-base"
              style={{
                background: "#1A1A1A", // Matte Black
                border: "1px solid #5C2E91", // Purple Outline
                color: "#F0E6FF"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-medium py-2 sm:py-3 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-70 text-sm sm:text-base"
            style={{
              background: isLoading ? "#B478FF" : "#A259FF", // Electric/Vivid Purple
              color: "#0B0B0B"
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#B478FF")}
            onMouseOut={e => (e.currentTarget.style.background = isLoading ? "#B478FF" : "#A259FF")}
          >
            {isLoading ? 'Generating Roadmap...' : 'Generate My Roadmap'}
          </button>
        </form>
      </div>
    </main>
  );
}
