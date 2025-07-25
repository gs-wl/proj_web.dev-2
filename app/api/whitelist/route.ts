import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const whitelistPath = path.join(process.cwd(), 'src/data/whitelist.json');
    const whitelistData = fs.readFileSync(whitelistPath, 'utf8');
    const whitelist = JSON.parse(whitelistData);
    
    console.log('📋 API: Serving whitelist with', whitelist.whitelistedAddresses.length, 'addresses');
    
    return NextResponse.json(whitelist, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error loading whitelist from API:', error);
    return NextResponse.json(
      { error: 'Failed to load whitelist' }, 
      { status: 500 }
    );
  }
}