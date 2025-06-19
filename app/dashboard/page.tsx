// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Roadmap, WeeklyTask } from '@/lib/ai-client';
import { useAuth } from '@/context/AuthContext';
import ResponsiveHeader from '@/app/dashboard/header';


export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [currentWeek, setCurrentWeek] = useState<WeeklyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'ongoing' | 'completed' | 'all'>('all');

  const router = useRouter();
  const searchParams = useSearchParams();
  const roadmapId = searchParams.get('roadmapId');
  const { user, logout } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if ( !user) {
      router.push('/');
    }
  }, [user,  router]);

  // Fetch roadmaps
  useEffect(() => {
    // In your fetchRoadmaps function in app/dashboard/page.tsx
    async function fetchRoadmaps() {
      try {
        setLoading(true);
        const url = user ? `/api/roadmaps?userId=${user.uid}` : '/api/roadmaps';

        console.log('Fetching roadmaps from:', url);

        const response = await fetch(url);

        // Check if response is ok before trying to parse
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);

          // Try to get more detailed error information
          try {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            setError(`Failed to load roadmaps: ${errorData.message || response.statusText}`);
          } catch (parseError) {
            // If we can't parse the error response as JSON
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            setError(`Failed to load roadmaps: ${response.statusText}`);
          }

          setLoading(false);
          return;
        }

        // Get the response text
        const text = await response.text();

        // If the response is empty, handle it gracefully
        if (!text || text.trim() === '') {
          console.log('Empty response from API, using empty array');
          setRoadmaps([]);
          setLoading(false);
          return;
        }

        // Try to parse as JSON
        try {
          const data = JSON.parse(text);
          console.log('Roadmaps data received:', data);
          setRoadmaps(data.roadmaps || []);

          // If roadmapId is in URL, set that as active
          if (roadmapId && data.roadmaps && data.roadmaps.length > 0) {
            const selected = data.roadmaps.find((r) => r.id === roadmapId);
            if (selected && selected.weeks && selected.weeks.length > 0) {
              setActiveRoadmap(selected);
              // Find first incomplete week
              const nextWeek = selected.weeks.find((w) => !w.completed);
              setCurrentWeek(nextWeek || selected.weeks[0]);
            }
          } else if (data.roadmaps && data.roadmaps.length > 0) {
            // If no roadmapId in URL, set the first roadmap as active
            setActiveRoadmap(data.roadmaps[0]);
            const firstWeek = data.roadmaps[0].weeks.find(w => !w.completed) || data.roadmaps[0].weeks[0];
            setCurrentWeek(firstWeek);
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response was:', text);
          setError('Invalid response from server');
        }
      } catch (error) {
        console.error('Failed to fetch roadmaps:', error);
        setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }



    if (user) {
      fetchRoadmaps();
    }
  }, [user, roadmapId]);

  const handleRoadmapSelect = (roadmap: Roadmap) => {
    setActiveRoadmap(roadmap);
    // Find first incomplete week
    const nextWeek = roadmap.weeks.find(w => !w.completed);
    setCurrentWeek(nextWeek || roadmap.weeks[0]);
  };

  const handleWeekComplete = async (completed: boolean) => {
    if (!activeRoadmap || !currentWeek) return;

    try {
      const response = await fetch(`/api/roadmaps/${activeRoadmap.id}`, {
        method: 'PUT', // Changed from PATCH to PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek.week,
          completed
        })
      });

      // Check if response is ok before trying to parse
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        alert(`Failed to update week status: ${response.statusText}`);
        return;
      }

      // Get response as text first
      const text = await response.text();

      // Check if response is empty
      if (!text || text.trim() === '') {
        console.error('Empty response from API');
        alert('Server returned an empty response');
        return;
      }

      // Try to parse as JSON
      try {
        const data = JSON.parse(text);

        // Update roadmaps state
        setRoadmaps(roadmaps.map(r =>
          r.id === activeRoadmap.id ? data.roadmap : r
        ));

        // Update active roadmap
        setActiveRoadmap(data.roadmap);

        // If marked as completed, move to next week
        if (completed) {
          const nextWeekIndex = activeRoadmap.weeks.findIndex(w => w.week === currentWeek.week) + 1;
          if (nextWeekIndex < activeRoadmap.weeks.length) {
            setCurrentWeek(data.roadmap.weeks[nextWeekIndex]);
          }
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', text);
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to update week status:', error);
      alert('Network error: Failed to update week status');
    }
  };

  async function clearDatabase(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (confirm('Are you sure you want to clear all roadmaps? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/clear-database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to clear database: ${errorText}`);
        }

        const data = await response.json();

        if (data.success) {
          alert('Database cleared successfully');
          setRoadmaps([]);
          setActiveRoadmap(null);
          setCurrentWeek(null);
        } else {
          alert(`Failed to clear database: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error clearing database:', error);
        setError(`Failed to clear database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  }

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    if (view === 'all') return true;
    if (view === 'completed') return roadmap.isCompleted;
    return !roadmap.isCompleted; // ongoing
  });

  // if (authLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-[#0023] border-t-transparent rounded-full animate-spin mx-auto"></div>
  //         <p className="mt-4 text-[#2369]">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen transition ">

      <ResponsiveHeader
        user={user}
        clearDatabase={clearDatabase}
        logout={logout}
      />


      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Link href="/" className="mt-4 inline-block bg-[#0023] text-[#2296] px-4 py-2 rounded-lg">
              Go Back Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with roadmap list */}
            <div className="lg:col-span-1 bg-black rounded-lg shadow p-4">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2" style={{ color: "#A259FF" }}>
                  My Roadmaps
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setView('all')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition`}
                    style={
                      view === 'all'
                        ? {
                          background: "#A259FF",
                          color: "#0B0B0B",
                          border: "1.5px solid #5C2E91"
                        }
                        : {
                          background: "#1A1A1A",
                          color: "#F0E6FF",
                          border: "1.5px solid #5C2E91"
                        }
                    }
                    onMouseOver={e => {
                      if (view !== 'all') {
                        e.currentTarget.style.background = "#B478FF";
                        e.currentTarget.style.color = "#0B0B0B";
                      }
                    }}
                    onMouseOut={e => {
                      if (view !== 'all') {
                        e.currentTarget.style.background = "#1A1A1A";
                        e.currentTarget.style.color = "#F0E6FF";
                      }
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setView('ongoing')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition`}
                    style={
                      view === 'ongoing'
                        ? {
                          background: "#A259FF",
                          color: "#0B0B0B",
                          border: "1.5px solid #5C2E91"
                        }
                        : {
                          background: "#1A1A1A",
                          color: "#F0E6FF",
                          border: "1.5px solid #5C2E91"
                        }
                    }
                    onMouseOver={e => {
                      if (view !== 'ongoing') {
                        e.currentTarget.style.background = "#B478FF";
                        e.currentTarget.style.color = "#0B0B0B";
                      }
                    }}
                    onMouseOut={e => {
                      if (view !== 'ongoing') {
                        e.currentTarget.style.background = "#1A1A1A";
                        e.currentTarget.style.color = "#F0E6FF";
                      }
                    }}
                  >
                    Ongoing
                  </button>
                  <button
                    onClick={() => setView('completed')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition`}
                    style={
                      view === 'completed'
                        ? {
                          background: "#A259FF",
                          color: "#0B0B0B",
                          border: "1.5px solid #5C2E91"
                        }
                        : {
                          background: "#1A1A1A",
                          color: "#F0E6FF",
                          border: "1.5px solid #5C2E91"
                        }
                    }
                    onMouseOver={e => {
                      if (view !== 'completed') {
                        e.currentTarget.style.background = "#B478FF";
                        e.currentTarget.style.color = "#0B0B0B";
                      }
                    }}
                    onMouseOut={e => {
                      if (view !== 'completed') {
                        e.currentTarget.style.background = "#1A1A1A";
                        e.currentTarget.style.color = "#F0E6FF";
                      }
                    }}
                  >
                    Completed
                  </button>
                </div>
              </div>


              {filteredRoadmaps.length === 0 ? (
                <div className="text-center py-8 text-purple-800">
                  No roadmaps found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRoadmaps.map(roadmap => (
                    <button
                      key={roadmap.id}
                      onClick={() => handleRoadmapSelect(roadmap)}
                      className={`w-full text-left text-purple-950 p-3 rounded-lg ${activeRoadmap?.id === roadmap.id
                        ? 'bg-purple-500 hover:bg-purple-950 hover:text-purple-300 text-purple-200'
                        : 'bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950'
                        }`}
                    >
                      <div className="font-medium">{roadmap.topic}</div>
                      <div className="text-sm text-[#M001] mt-1">
                        Progress: {roadmap.progress}%
                      </div>
                      <div className="w-full bg-purple-50 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-purple-800 h-1.5 rounded-full"
                          style={{ width: `${roadmap.progress}%` }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              {!activeRoadmap ? (
                <div className="bg-[#M001] rounded-lg shadow p-8 text-center">
                  <h2 className="text-xl font-medium text-white mb-2">
                    Select a roadmap or create a new one
                  </h2>
                  <p className="text-white mb-6">
                    Choose a roadmap from the sidebar to view your weekly tasks, or create a new learning journey.
                  </p>
                  <Link
                    href="/create"
                    className="px-4 py-2 bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950 rounded-lg "
                  >
                    Create New Roadmap
                  </Link>
                </div>
              ) : (
                <div className="bg-[#M001] rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b border-[#0753]">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">{activeRoadmap.topic}</h2>
                      <Link
                        href={`/roadmap/${activeRoadmap.id}`}
                        className=" hover:bg-purple-950 hover:text-purple-500 text-white hover:rounded-lg p-3 text-sm"
                      >
                        View Full Roadmap
                      </Link>
                    </div>
                    <div className="mt-2 flex text-white items-center">
                      <span className="text-sm mr-2">Overall Progress:</span>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-800 h-2 rounded-full"
                          style={{ width: `${activeRoadmap.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{activeRoadmap.progress}%</span>
                    </div>
                  </div>

                  {currentWeek && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg text-white font-medium">
                          Week {currentWeek.week}: {currentWeek.title}
                        </h3>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weekComplete"
                            checked={currentWeek.completed}
                            onChange={(e) => handleWeekComplete(e.target.checked)}
                            className="h-5 w-5 text-[#0023] rounded"
                          />
                          <label htmlFor="weekComplete" className="ml-2 text-sm text-white">
                            Mark as completed
                          </label>
                        </div>
                      </div>

                      <div className="bg-purple-800 p-4 rounded-lg mb-4">
                        <p className="text-white">{currentWeek.description}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-2">Subtopics</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {currentWeek.subtopics.map((subtopic, index) => (
                            <li key={index} className="text-white">{subtopic}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-2">Learning Resources</h4>
                        <div className="space-y-4">
                          <div>
                            <h1 className=" font-medium text-white mb-1">Videos:</h1>
                            <ul className="space-y-1">
                              {currentWeek.resources.videos.map((video, index) => (
                                <li key={index}>
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white underline hover:text-purple-600"
                                  >
                                    {video.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h1 className=" font-medium text-white mb-1">Documentation:</h1>
                            <ul className="space-y-1">
                              {currentWeek.resources.documentation.map((doc, index) => (
                                <li key={index}>
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white underline hover:text-purple-600"
                                  >
                                    {doc.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Weekly Project</h4>
                        <div className="bg-purple-800 p-4 rounded-lg border border-[#0023]/20">
                          <p className="text-white">{currentWeek.project}</p>
                        </div>
                      </div>

                      {/* Week Navigation */}
                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={() => {
                            const currentIndex = activeRoadmap.weeks.findIndex(w => w.week === currentWeek.week);
                            if (currentIndex > 0) {
                              setCurrentWeek(activeRoadmap.weeks[currentIndex - 1]);
                            }
                          }}
                          disabled={currentWeek.week === activeRoadmap.weeks[0].week}
                          className="px-4 py-2 bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950 rounded-lg "
                        >
                          Previous Week
                        </button>
                        <button
                          onClick={() => {
                            const currentIndex = activeRoadmap.weeks.findIndex(w => w.week === currentWeek.week);
                            if (currentIndex < activeRoadmap.weeks.length - 1) {
                              setCurrentWeek(activeRoadmap.weeks[currentIndex + 1]);
                            }
                          }}
                          disabled={currentWeek.week === activeRoadmap.weeks[activeRoadmap.weeks.length - 1].week}
                          className="px-4 py-2 bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950 rounded-lg "
                        >
                          Next Week
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Week Selection */}
                  <div className="p-6 border-t border-[#0753]">
                    <h4 className="font-medium text-white mb-3">Jump to Week</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeRoadmap.weeks.map((week, index) => (
                        <button
                          key={`week-btn-${week.week}-${index}`}
                          onClick={() => setCurrentWeek(week)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${currentWeek?.week === week.week
                            ? 'bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950'
                            : week.completed
                              ? 'hover:bg-purple-300 bg-purple-950 text-purple-300 hover:text-purple-950'
                              : 'bg-purple-300 hover:bg-purple-950 hover:text-purple-300 text-purple-950'
                            }`}
                        >
                          {week.week}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
