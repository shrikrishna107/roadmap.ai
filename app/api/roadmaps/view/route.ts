// app/api/admin/view-database/route.ts
import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/db';

export async function GET() {
  try {
    const roadmaps = await serverDb.getRoadmaps();
    return NextResponse.json({ roadmaps });
  } catch (error) {
    console.error('Error fetching database:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch database',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
