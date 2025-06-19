// app/api/roadmaps/[id]/route.ts
import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/db';

// GET method to fetch a roadmap by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const roadmap = await databaseService.getRoadmapById(id);
    
    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }
    
    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch roadmap',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH method to update a roadmap's week status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const { weekNumber, completed } = await request.json();
    
    if (weekNumber === undefined || completed === undefined) {
      return NextResponse.json({ error: 'Week number and completed status are required' }, { status: 400 });
    }
    
    const updatedRoadmap = await databaseService.updateWeekStatus(id, weekNumber, completed);
    
    if (!updatedRoadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }
    
    return NextResponse.json({ roadmap: updatedRoadmap });
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json({ error: 'Failed to update roadmap' }, { status: 500 });
  }
}

// Add PUT method as an alternative to PATCH for broader compatibility
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Reuse the same implementation as PATCH
  return PATCH(request, { params });
}

// Add OPTIONS method for CORS support
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
