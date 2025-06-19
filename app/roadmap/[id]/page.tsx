'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Roadmap } from '@/lib/ai-client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const response = await fetch(`/api/roadmaps/${id}`);
        if (!response.ok) {
          setError(`Failed to load roadmap: ${response.statusText}`);
          setLoading(false);
          return;
        }
        const text = await response.text();
        if (!text || text.trim() === '') {
          setError('Server returned an empty response');
          setLoading(false);
          return;
        }
        const data = JSON.parse(text);
        if (data.roadmap) {
          setRoadmap(data.roadmap);
        } else {
          setError('No roadmap data received');
        }
      } catch (error) {
        setError('Failed to fetch roadmap');
      } finally {
        setLoading(false);
      }
    }
    if (user && id) {
      fetchRoadmap();
    }
  }, [id, router, user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0B0B0B" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A259FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4" style={{ color: "#A259FF" }}>Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !roadmap) {
    return (
      <div className="flex min-h-screen items-center justify-center px-2" style={{ background: "#0B0B0B" }}>
        <div className="text-center w-full max-w-md rounded-xl shadow-lg p-6" style={{ background: "#121212", border: "1px solid #5C2E91" }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#A259FF" }}>
            Roadmap Not Found
          </h2>
          <p className="mt-2 text-base sm:text-lg" style={{ color: "#F0E6FF" }}>
            {error || "The roadmap you're looking for doesn't exist."}
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition"
            style={{
              background: "#A259FF",
              color: "#0B0B0B",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#B478FF";
              e.currentTarget.style.color = "#0B0B0B";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#A259FF";
              e.currentTarget.style.color = "#0B0B0B";
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-2 sm:px-4" style={{ background: "#0B0B0B" }}>
      <div className="max-w-5xl mx-auto rounded-xl shadow-md overflow-hidden" style={{ background: "#121212", border: "1px solid #5C2E91" }}>
        <div className="p-4 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words" style={{ color: "#A259FF" }}>
              {roadmap.topic} Roadmap
            </h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition"
                style={{
                  background: "#A259FF",
                  color: "#0B0B0B"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#B478FF";
                  e.currentTarget.style.color = "#0B0B0B";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#A259FF";
                  e.currentTarget.style.color = "#0B0B0B";
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => router.push(`/dashboard?roadmapId=${roadmap.id}`)}
                className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition"
                style={{
                  background: "#A259FF",
                  color: "#0B0B0B"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#B478FF";
                  e.currentTarget.style.color = "#0B0B0B";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#A259FF";
                  e.currentTarget.style.color = "#0B0B0B";
                }}
              >
                Start Weekly Tasks
              </button>
            </div>
          </div>
          
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "#A259FF" }}>Overview</h2>
            <p className="text-sm sm:text-base" style={{ color: "#F0E6FF" }}>{roadmap.overview}</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sm sm:text-base" style={{ color: "#F0E6FF" }}>Progress:</span>
              <div className="w-full rounded-full h-2.5" style={{ background: "#5C2E91" }}>
                <div 
                  className="rounded-full h-2.5"
                  style={{
                    background: "#A259FF",
                    width: `${roadmap.progress}%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm sm:text-base font-medium" style={{ color: "#F0E6FF" }}>{roadmap.progress}%</span>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: "#A259FF" }}>Roadmap Timeline</h2>
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: "#5C2E91" }}></div>
              <div className="space-y-8">
                {roadmap.weeks.map((week, index) => (
                  <div key={`week-${week.week}-${index}`} className="relative pl-10">
                    <div
                      className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: week.completed ? "#802EFF" : "#A259FF",
                        color: "#F0E6FF",
                        border: "2px solid #5C2E91"
                      }}
                    >
                      <span className="text-sm font-bold">{week.week}</span>
                    </div>
                    <div
                      className="p-3 sm:p-4 rounded-lg border"
                      style={{
                        background: "#1A1A1A",
                        color: "#F0E6FF",
                        borderColor: "#5C2E91"
                      }}
                    >
                      <h3 className="font-medium text-base sm:text-lg" style={{ color: "#A259FF" }}>{week.title}</h3>
                      <p className="mt-1 text-sm sm:text-base">{week.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
