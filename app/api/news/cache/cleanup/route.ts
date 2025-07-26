import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cleanupExpiredCache, CACHE_FILE_PATH, type CachedNewsData } from '../../../../../utils/newsCache';

// POST - Manual cleanup trigger
export async function POST() {
  try {
    const result = cleanupExpiredCache();
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in cleanup endpoint:', error);
    return NextResponse.json({
      success: false,
      cleaned: false,
      message: 'Error in cleanup endpoint'
    }, { status: 500 });
  }
}

// GET - Check cache status and cleanup if needed
export async function GET() {
  try {
    const result = cleanupExpiredCache();
    
    // Also provide cache status information
    let cacheStatus = 'No cache file';
    let cacheAge = 0;
    
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      const cachedData: CachedNewsData = JSON.parse(fileContent);
      
      if (cachedData.lastUpdated) {
        cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
        cacheStatus = `Cache age: ${Math.round(cacheAge / (60 * 60 * 1000))} hours`;
      }
    }
    
    return NextResponse.json({
      success: true,
      ...result,
      cacheStatus,
      cacheAgeHours: Math.round(cacheAge / (60 * 60 * 1000))
    });
  } catch (error) {
    console.error('Error in cleanup status endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking cleanup status'
    }, { status: 500 });
  }
}