import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const adminWalletsPath = path.join(process.cwd(), 'src/data/admin-wallets.json');
    const adminWalletsData = fs.readFileSync(adminWalletsPath, 'utf8');
    const adminWallets = JSON.parse(adminWalletsData);
    
    console.log('📋 API: Serving admin wallets with', adminWallets.adminAddresses.length, 'addresses');
    
    return NextResponse.json(adminWallets, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error loading admin wallets from API:', error);
    return NextResponse.json(
      { error: 'Failed to load admin wallets' }, 
      { status: 500 }
    );
  }
}