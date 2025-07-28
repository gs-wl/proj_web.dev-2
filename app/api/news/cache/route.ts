import { NextRequest, NextResponse } from 'next/server';
import { getCachedNewsData, saveCachedNewsData, clearCachedNewsData } from '@/utils/newsCache';

// GET - Retrieve cached data
export async function GET() {
  try {
    const result = await getCachedNewsData();
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        message: result.message,
        data: null 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: result.data 
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
    const { twitterPosts, aiNews } = await request.json();

    const result = await saveCachedNewsData(twitterPosts || [], aiNews || []);

    return NextResponse.json({ 
      success: result.success, 
      message: result.message 
    });
  } catch (error) {
    console.error('Error saving cache:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error saving cache' 
    });
  }
}

// DELETE - Clear cache
export async function DELETE() {
  try {
    const result = await clearCachedNewsData();

    return NextResponse.json({ 
      success: result.success, 
      message: result.message 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error clearing cache' 
    });
  }
}