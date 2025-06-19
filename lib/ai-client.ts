// lib/ai-client.ts
import { headers } from 'next/headers';

const OPENROUTER_API_KEY = "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";

export interface RoadmapRequest {
  topic: string;
}

export interface WeeklyTask {
  week: number;
  title: string;
  description: string;
  subtopics: string[];
  resources: {
    videos: { title: string, url: string }[];
    documentation: { title: string, url: string }[];
  };
  project: string;
  completed: boolean;
}

export interface Roadmap {
  userId: string;
  id: string;
  topic: string;
  overview: string;
  duration: number;
  weeks: WeeklyTask[];
  createdAt: Date;
  progress: number;
  isCompleted: boolean;
}

// Removed duplicate generateRoadmap function to resolve redeclaration and duplicate implementation errors.

// Add debugging to lib/ai-client.ts
export async function generateRoadmap(topic: string) {
  console.log(`Starting roadmap generation for topic: ${topic}`);
  
  try {
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const response = await fetch(`${protocol}://${host}/api/generate-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI service error: ${response.status} ${response.statusText}`);
      console.error('Error response:', errorText);
      throw new Error(`AI service error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('AI response received:', data);
    
    // Process the AI response into a roadmap structure
    const roadmap = processAIResponse(data, topic);
    console.log('Roadmap processed successfully');
    
    return roadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
}


function processAIResponse(aiResponse: string, topic: string): Roadmap {
  // This function parses the AI's text response into our structured Roadmap format
  const weeks: WeeklyTask[] = [];
  
  try {
    // Extract overview from the beginning of the response
    const overviewMatch = aiResponse.match(/^(.*?)(?=Month 1|Week 1)/);
    const overview = overviewMatch ? overviewMatch[0].trim() : `Comprehensive roadmap to master ${topic}`;
    
    // Extract week information using regex
    const weekPattern = /Week (\d+):\s*(.*?)(?=Week \d+:|$)/g;
    let match;
    let weekCount = 0;
    
    while ((match = weekPattern.exec(aiResponse)) !== null) {
      weekCount++;
      const weekNum = parseInt(match[1]);
      const weekContent = match[2].trim();
      
      // Extract title
      const titleMatch = weekContent.match(/^(.*?)(?=\n|$)/);
      const title = titleMatch ? titleMatch[0].trim() : `Introduction to ${topic} - Week ${weekNum}`;
      
      // Extract description
      const descMatch = weekContent.match(/(?<=\n)(.*?)(?=\n|$)/);
      const description = descMatch ? descMatch[0].trim() : `Core concepts for week ${weekNum}`;
      
      // Extract subtopics (simplified)
      const subtopics: string[] = [];
      const subtopicMatches = weekContent.match(/[-•]\s*(.*?)(?=\n|$)/g);
      if (subtopicMatches) {
        subtopicMatches.forEach(match => {
          const subtopic = match.replace(/^[-•]\s*/, '').trim();
          if (subtopic) subtopics.push(subtopic);
        });
      }
      
      // If no subtopics found, add placeholders
      if (subtopics.length === 0) {
        subtopics.push(`${topic} concept ${weekNum}.1`);
        subtopics.push(`${topic} concept ${weekNum}.2`);
      }
      
      // Extract resources (simplified)
      const videos: { title: string, url: string }[] = [];
      const documentation: { title: string, url: string }[] = [];
      
      // Look for URLs in the week content
      const urlMatches = weekContent.match(/https?:\/\/[^\s)]+/g);
      if (urlMatches) {
        urlMatches.forEach((url, index) => {
          if (url.includes('youtube') || url.includes('youtu.be')) {
            videos.push({
              title: `${topic} Tutorial ${index + 1}`,
              url
            });
          } else {
            documentation.push({
              title: `${topic} Resource ${index + 1}`,
              url
            });
          }
        });
      }
      
      // Add placeholder resources if none found
      if (videos.length === 0) {
        videos.push({ 
          title: `${topic} Tutorial ${weekNum}.1`, 
          url: 'https://youtube.com/example1' 
        });
        videos.push({ 
          title: `${topic} Tutorial ${weekNum}.2`, 
          url: 'https://youtube.com/example2' 
        });
      }
      
      if (documentation.length === 0) {
        documentation.push({ 
          title: `${topic} Documentation`, 
          url: 'https://example.com/docs' 
        });
      }
      
      // Extract project
      const projectMatch = weekContent.match(/project:?\s*(.*?)(?=\n|$)/i);
      const project = projectMatch 
        ? projectMatch[1].trim() 
        : `Build a simple ${topic} project for week ${weekNum}`;
      
      weeks.push({
        week: weekNum,
        title,
        description,
        subtopics,
        resources: {
          videos,
          documentation
        },
        project,
        completed: false
      });
    }
    
    // If no weeks were extracted, create placeholder weeks
    if (weeks.length === 0) {
      const mockWeeks = 16;
      for (let i = 1; i <= mockWeeks; i++) {
        weeks.push({
          week: i,
          title: `Week ${i}: Introduction to ${topic} - Part ${i}`,
          description: `Core concepts and fundamentals for week ${i}`,
          subtopics: ['Subtopic 1', 'Subtopic 2', 'Subtopic 3'],
          resources: {
            videos: [
              { title: `${topic} Tutorial ${i}`, url: 'https://youtube.com/example1' },
              { title: `Advanced ${topic} Concepts ${i}`, url: 'https://youtube.com/example2' }
            ],
            documentation: [
              { title: `${topic} Documentation`, url: 'https://example.com/docs' },
              { title: `${topic} Best Practices`, url: 'https://example.com/best-practices' }
            ]
          },
          project: `Build a simple ${topic} project ${i}`,
          completed: false
        });
      }
    }
    
return {
  id: Date.now().toString(),
  topic,
  overview,
  duration: weeks.length,
  weeks,
  createdAt: new Date(),
  progress: 0,
  isCompleted: false,
  userId: ''
};
  } catch (error) {
    console.error('Error parsing AI response:', error);
    
    // Fallback to mock data if parsing fails
    const mockWeeks = 16;
    for (let i = 1; i <= mockWeeks; i++) {
      weeks.push({
        week: i,
        title: `Week ${i}: Introduction to ${topic} - Part ${i}`,
        description: `Core concepts and fundamentals for week ${i}`,
        subtopics: ['Subtopic 1', 'Subtopic 2', 'Subtopic 3'],
        resources: {
          videos: [
            { title: `${topic} Tutorial ${i}`, url: 'https://youtube.com/example1' },
            { title: `Advanced ${topic} Concepts ${i}`, url: 'https://youtube.com/example2' }
          ],
          documentation: [
            { title: `${topic} Documentation`, url: 'https://example.com/docs' },
            { title: `${topic} Best Practices`, url: 'https://example.com/best-practices' }
          ]
        },
        project: `Build a simple ${topic} project ${i}`,
        completed: false
      });
    }
    
return {
  id: Date.now().toString(),
  topic,
  overview: `Comprehensive roadmap to master ${topic} from beginner to advanced level.`,
  duration: mockWeeks,
  weeks,
  createdAt: new Date(),
  progress: 0,
  isCompleted: false,
  userId: ''
};
  }
}
