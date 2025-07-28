import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredCache, getCachedNewsData } from '@/utils/newsCache';

// POST - Manual cleanup trigger
export async function POST() {
  try {
    const result = await cleanupExpiredCache();
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in cleanup endpoint:', error);
    return NextResponse.json({
      success: false,
      cleaned: false,
      message: 'Error during cleanup'
    });
  }
}

// GET - Check cleanup status and current cache info
export async function GET() {
  try {
    const cleanupResult = await cleanupExpiredCache();
    const cacheResult = await getCachedNewsData();
    
    return NextResponse.json({
      success: true,
      ...cleanupResult,
      cacheExists: cacheResult.success,
      cacheData: cacheResult.success ? {
        lastUpdated: cacheResult.data?.lastUpdated,
        twitterPostsCount: cacheResult.data?.twitterPosts?.length || 0,
        aiNewsCount: cacheResult.data?.aiNews?.length || 0
      } : null
    });
  } catch (error) {
    console.error('Error in cleanup status endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking cleanup status'
    });
  }
}