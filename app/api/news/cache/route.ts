import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cleanupExpiredCache, CACHE_FILE_PATH, CACHE_EXPIRY_HOURS, type CachedNewsData } from '../../../../utils/newsCache';

// GET - Retrieve cached data
export async function GET() {
  try {
    // Run cleanup check before retrieving cache
    cleanupExpiredCache();
    
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return NextResponse.json({ 
        success: false, 
        message: 'No cache found',
        data: null 
      });
    }

    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const cachedData: CachedNewsData = JSON.parse(fileContent);

    // Check if cache is expired
    if (cachedData.lastUpdated) {
      const cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
      const isExpired = cacheAge > (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
      
      if (isExpired) {
        return NextResponse.json({ 
          success: false, 
          message: 'Cache expired',
          data: null 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: cachedData 
    });
  } catch (error) {
    console.error('Error reading cache:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error reading cache',
      data: null 
    });
  }
}

// POST - Save data to cache
export async function POST(request: NextRequest) {
  try {
    // Run cleanup check before saving new cache
    cleanupExpiredCache();
    
    const { twitterPosts, aiNews } = await request.json();

    const dataToCache: CachedNewsData = {
      twitterPosts: twitterPosts || [],
      aiNews: aiNews || [],
      lastUpdated: new Date().toISOString(),
      version: 1
    };

    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(dataToCache, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Cache updated successfully' 
    });
  } catch (error) {
    console.error('Error saving cache:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error saving cache' 
    }, { status: 500 });
  }
}

// DELETE - Clear cache
export async function DELETE() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error clearing cache' 
    }, { status: 500 });
  }
}