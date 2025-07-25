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

function generateRequestId(): string {
  return 'req_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, name, email, company, reason, experience } = body;

    // Validate required fields
    if (!walletAddress || !name || !email || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Load existing requests
    const requestsPath = path.join(process.cwd(), 'src/data/whitelist-requests.json');
    let requestsData: WhitelistRequestsData;
    
    try {
      const fileContent = fs.readFileSync(requestsPath, 'utf8');
      requestsData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, create initial structure
      requestsData = {
        requests: [],
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
    }

    // Check if wallet address already has a pending or approved request
    const existingRequest = requestsData.requests.find(
      req => req.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return NextResponse.json(
          { error: 'A request for this wallet address is already pending review' },
          { status: 409 }
        );
      }
      if (existingRequest.status === 'approved') {
        return NextResponse.json(
          { error: 'This wallet address is already whitelisted' },
          { status: 409 }
        );
      }
    }

    // Create new request
    const newRequest: WhitelistRequest = {
      id: generateRequestId(),
      walletAddress,
      name,
      email,
      company: company || '',
      reason,
      defiExperience: experience || '',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Add to requests array
    requestsData.requests.push(newRequest);
    requestsData.lastUpdated = new Date().toISOString();

    // Save updated requests
    fs.writeFileSync(requestsPath, JSON.stringify(requestsData, null, 2));

    console.log(`✅ New whitelist request submitted: ${newRequest.id} for ${walletAddress}`);

    return NextResponse.json({
      success: true,
      message: 'Whitelist request submitted successfully',
      requestId: newRequest.id
    });

  } catch (error) {
    console.error('Error processing whitelist request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}