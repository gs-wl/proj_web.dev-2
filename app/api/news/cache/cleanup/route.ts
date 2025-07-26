import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src/data/news-cache.json');
const CACHE_EXPIRY_HOURS = 24;

interface CachedNewsData {
  twitterPosts: any[];
  aiNews: any[];
  lastUpdated: string;
  version: number;
}

// Function to check and clean expired cache
function cleanupExpiredCache(): { cleaned: boolean; message: string } {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return {
        cleaned: false,
        message: 'No cache file found'
      };
    }

    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const cachedData: CachedNewsData = JSON.parse(fileContent);

    // Check if cache is expired
    if (cachedData.lastUpdated) {
      const cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
      const isExpired = cacheAge > (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
      
      if (isExpired) {
        fs.unlinkSync(CACHE_FILE_PATH);
        return {
          cleaned: true,
          message: `Expired cache file deleted (age: ${Math.round(cacheAge / (60 * 60 * 1000))} hours)`
        };
      }
    }

    return {
      cleaned: false,
      message: 'Cache is still valid'
    };
  } catch (error) {
    console.error('Error during cache cleanup:', error);
    return {
      cleaned: false,
      message: `Error during cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

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