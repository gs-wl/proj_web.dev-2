import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface WhitelistRequest {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  company: string;
  reason: string;
  defiExperience: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface WhitelistRequestsData {
  requests: WhitelistRequest[];
  lastUpdated: string;
  version: string;
}

export async function GET() {
  try {
    const requestsPath = path.join(process.cwd(), 'src/data/whitelist-requests.json');
    const requestsData = fs.readFileSync(requestsPath, 'utf8');
    const requests = JSON.parse(requestsData);
    
    console.log('📋 API: Serving whitelist requests with', requests.requests.length, 'requests');
    
    return NextResponse.json(requests, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error loading whitelist requests from API:', error);
    return NextResponse.json(
      { error: 'Failed to load whitelist requests' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, requestId, walletAddress } = body;

    if (action === 'approve' && requestId && walletAddress) {
      // Add to whitelist
      const whitelistPath = path.join(process.cwd(), 'src/data/whitelist.json');
      const whitelistData = fs.readFileSync(whitelistPath, 'utf8');
      const whitelist = JSON.parse(whitelistData);
      
      // Check if address is already whitelisted
      const lowerCaseWhitelist = whitelist.whitelistedAddresses.map((addr: string) => addr.toLowerCase());
      const lowerCaseAddress = walletAddress.toLowerCase();
      
      if (!lowerCaseWhitelist.includes(lowerCaseAddress)) {
        whitelist.whitelistedAddresses.push(walletAddress);
        whitelist.lastUpdated = new Date().toISOString();
        fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2));
      }
      
      // Update request status
      const requestsPath = path.join(process.cwd(), 'src/data/whitelist-requests.json');
      const requestsData = fs.readFileSync(requestsPath, 'utf8');
      const requests: WhitelistRequestsData = JSON.parse(requestsData);
      
      const requestIndex = requests.requests.findIndex(req => req.id === requestId);
      if (requestIndex !== -1) {
        requests.requests[requestIndex].status = 'approved';
        requests.lastUpdated = new Date().toISOString();
        fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
      }
      
      console.log(`✅ Approved whitelist request ${requestId} for address ${walletAddress}`);
      
      return NextResponse.json({ success: true, message: 'Request approved and address whitelisted' });
    }
    
    if (action === 'reject' && requestId) {
      // Update request status to rejected
      const requestsPath = path.join(process.cwd(), 'src/data/whitelist-requests.json');
      const requestsData = fs.readFileSync(requestsPath, 'utf8');
      const requests: WhitelistRequestsData = JSON.parse(requestsData);
      
      const requestIndex = requests.requests.findIndex(req => req.id === requestId);
      if (requestIndex !== -1) {
        requests.requests[requestIndex].status = 'rejected';
        requests.lastUpdated = new Date().toISOString();
        fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
      }
      
      console.log(`❌ Rejected whitelist request ${requestId}`);
      
      return NextResponse.json({ success: true, message: 'Request rejected' });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing whitelist request action:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}