// app/api/admin/clear-database/route.ts
import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/db';

export async function POST() {
  try {
    await serverDb.clearRoadmaps();
    return NextResponse.json({ success: true, message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

