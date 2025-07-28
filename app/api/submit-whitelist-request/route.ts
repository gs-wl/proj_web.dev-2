import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface WhitelistRequestInput {
  walletAddress: string;
  name: string;
  email: string;
  company?: string;
  reason: string;
  experience?: string;
}

function generateRequestId(): string {
  return 'req_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export async function POST(request: Request) {
  try {
    const body: WhitelistRequestInput = await request.json();
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

    // Check if wallet address already has a request
    const { data: existingRequest, error: checkError } = await supabase
      .from('whitelist_requests')
      .select('id, status')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing request:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing requests' },
        { status: 500 }
      );
    }

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

    // Check if address is already whitelisted
    const { data: whitelistedAddress, error: whitelistError } = await supabase
      .from('whitelisted_addresses')
      .select('id')
      .eq('address', walletAddress.toLowerCase())
      .single();

    if (whitelistError && whitelistError.code !== 'PGRST116') {
      console.error('Error checking whitelist:', whitelistError);
      return NextResponse.json(
        { error: 'Failed to check whitelist status' },
        { status: 500 }
      );
    }

    if (whitelistedAddress) {
      return NextResponse.json(
        { error: 'This wallet address is already whitelisted' },
        { status: 409 }
      );
    }

    // Create new request
    const requestId = generateRequestId();
    const { data: newRequest, error: insertError } = await supabase
      .from('whitelist_requests')
      .insert({
        id: requestId,
        wallet_address: walletAddress.toLowerCase(),
        name,
        email,
        company: company || null,
        reason,
        defi_experience: experience || null,
        submitted_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting whitelist request:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      );
    }

    console.log(`✅ New whitelist request submitted: ${requestId} for ${walletAddress}`);

    return NextResponse.json({
      success: true,
      message: 'Whitelist request submitted successfully',
      requestId: requestId
    });

  } catch (error) {
    console.error('Error processing whitelist request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}