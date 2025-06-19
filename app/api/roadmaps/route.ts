// app/api/roadmaps/route.ts
import { NextResponse } from 'next/server';
import { databaseService as firebaseDb } from '@/lib/db'; // Updated import
// Import removed to avoid the problematic external call
// import { generateRoadmap } from '@/lib/ai-client';

export async function GET(request: Request) {
  console.log('API route called:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('Fetching roadmaps for userId:', userId);
    
    // Add more detailed logging
    try {
      const roadmaps = await firebaseDb.getRoadmaps(userId || undefined);
      console.log('Roadmaps fetched successfully:', roadmaps ? roadmaps.length : 0);
      
      // Always return a valid JSON response, even if empty
      return NextResponse.json({ roadmaps: roadmaps || [] });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ 
        error: 'Database error', 
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        roadmaps: [] 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch roadmaps', 
      message: error instanceof Error ? error.message : 'Unknown error',
      roadmaps: [] 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('POST request to create roadmap');
  
  try {
    // Parse request body
    const body = await request.json();
    const { topic, userId } = body;
    
    console.log(`Creating roadmap for topic: "${topic}", userId: ${userId || 'none'}`);
    
    if (!topic) {
      console.error('Missing required field: topic');
      return NextResponse.json({ 
        error: 'Missing required field', 
        message: 'Topic is required' 
      }, { status: 400 });
    }
    
    try {
      // Generate roadmap directly instead of calling external function
      console.log('Generating roadmap directly...');
      
      // Create a simple roadmap structure
      const roadmap = {
        userId: userId || '', // Add userId to match Roadmap interface
        id: Date.now().toString(),
        topic,
        overview: `This is a comprehensive learning roadmap for ${topic}. It covers fundamental concepts, practical applications, and advanced techniques to help you master ${topic} over the course of 12 weeks.`,
        duration: 12,
        weeks: [
          {
            week: 1,
            title: `Introduction to ${topic}`,
            description: `Learn the basic concepts and fundamentals of ${topic}.`,
            subtopics: ["Basic concepts", "History and evolution", "Core principles"],
            resources: {
              videos: [
                { title: "Introduction to the basics", url: "https://www.youtube.com/results?search_query=introduction+to+" + encodeURIComponent(topic) },
                { title: "Getting started guide", url: "https://www.youtube.com/results?search_query=getting+started+with+" + encodeURIComponent(topic) }
              ],
              documentation: [
                { title: "Beginner's guide", url: "https://www.google.com/search?q=beginners+guide+to+" + encodeURIComponent(topic) },
                { title: "Fundamental concepts", url: "https://www.google.com/search?q=fundamental+concepts+of+" + encodeURIComponent(topic) }
              ]
            },
            project: `Create a simple project to demonstrate basic understanding of ${topic}`,
            completed: false
          },
          {
            week: 2,
            title: `Core Skills in ${topic}`,
            description: `Build essential skills and techniques in ${topic}.`,
            subtopics: ["Essential techniques", "Common tools", "Best practices"],
            resources: {
              videos: [
                { title: "Essential techniques", url: "https://www.youtube.com/results?search_query=essential+techniques+in+" + encodeURIComponent(topic) },
                { title: "Common tools overview", url: "https://www.youtube.com/results?search_query=tools+for+" + encodeURIComponent(topic) }
              ],
              documentation: [
                { title: "Best practices guide", url: "https://www.google.com/search?q=best+practices+in+" + encodeURIComponent(topic) },
                { title: "Tool documentation", url: "https://www.google.com/search?q=tools+documentation+for+" + encodeURIComponent(topic) }
              ]
            },
            project: `Implement core techniques in a small ${topic} project`,
            completed: false
          },
          {
            week: 3,
            title: `Intermediate ${topic}`,
            description: `Advance your knowledge with more complex concepts in ${topic}.`,
            subtopics: ["Advanced techniques", "Problem-solving strategies", "Optimization methods"],
            resources: {
              videos: [
                { title: "Advanced concepts", url: "https://www.youtube.com/results?search_query=advanced+" + encodeURIComponent(topic) },
                { title: "Problem-solving in " + topic, url: "https://www.youtube.com/results?search_query=problem+solving+in+" + encodeURIComponent(topic) }
              ],
              documentation: [
                { title: "Advanced guide", url: "https://www.google.com/search?q=advanced+guide+to+" + encodeURIComponent(topic) },
                { title: "Optimization techniques", url: "https://www.google.com/search?q=optimization+techniques+in+" + encodeURIComponent(topic) }
              ]
            },
            project: `Build an intermediate-level ${topic} project with advanced features`,
            completed: false
          }
        ],
        createdAt: new Date(),
        progress: 0,
        isCompleted: false
      };
      
      // Generate remaining weeks
      for (let i = 4; i <= 12; i++) {
        roadmap.weeks.push({
          week: i,
          title: `Advanced ${topic} - Week ${i}`,
          description: `Continue your journey in ${topic} with more specialized topics.`,
          subtopics: ["Specialized area " + (i-3), "Advanced concept " + (i-3)],
          resources: {
            videos: [
              { title: `Week ${i} tutorial`, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topic) + "+advanced+tutorial" }
            ],
            documentation: [
              { title: `Week ${i} reading`, url: "https://www.google.com/search?q=" + encodeURIComponent(topic) + "+advanced+concepts" }
            ]
          },
          project: `Week ${i} project: Build an advanced component for your ${topic} project`,
          completed: false
        });
      }
      
      // Save to database
      console.log('Saving roadmap to database...');
      const savedRoadmap = await firebaseDb.saveRoadmap(roadmap, userId);
      
      console.log(`Roadmap created successfully with ID: ${savedRoadmap.id}`);
      
      // Return the saved roadmap
      return NextResponse.json({ 
        roadmap: savedRoadmap,
        message: 'Roadmap created successfully' 
      });
    } catch (dbError) {
      console.error('Error creating roadmap:', dbError);
      return NextResponse.json({ 
        error: 'Failed to create roadmap', 
        message: dbError instanceof Error ? dbError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ 
      error: 'Invalid request', 
      message: error instanceof Error ? error.message : 'Failed to parse request body' 
    }, { status: 400 });
  }
}
