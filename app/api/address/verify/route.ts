import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function POST(request: Request) {
  try {
    const address = await request.json();
    
    // Log the incoming request
    console.log('📫 Verifying address:', {
      timestamp: new Date().toISOString(),
      addressId: address.id,
      requestData: address
    });

    const easyPostRequest = {
      address: {
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country || 'US',
      },
      verify: true
    };

    // Log what we're sending to EasyPost
    console.log('📤 EasyPost request:', {
      timestamp: new Date().toISOString(),
      endpoint: 'https://api.easypost.com/v2/addresses',
      payload: easyPostRequest
    });

    const response = await fetch('https://api.easypost.com/v2/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EASYPOST_API_KEY}`
      },
      body: JSON.stringify(easyPostRequest)
    });

    const result = await response.json();

    // Enhanced logging with expanded verification details
    console.log('📥 EasyPost response:', {
      timestamp: new Date().toISOString(),
      status: response.status,
      data: result
    });

    // Check for verification errors
    const verificationErrors = result.verifications?.delivery?.errors || [];
    const isValid = result.verifications?.delivery?.success === true && verificationErrors.length === 0;

    if (!isValid) {
      console.log('❌ Verification failed:', {
        timestamp: new Date().toISOString(),
        error: verificationErrors
      });
    }

    // Update address in database with verification results
    await prisma.addresses.update({
      where: { id: address.id },
      data: { 
        verified: true,
        
        valid: isValid ? 'VALID' : 'INVALID',
        residential: result.residential ?? null,
        easypost_id: result.id,
        street1: result.street1,
        street2: result.street2 || null,
        city: result.city,
        state: result.state,
        zip: result.zip,
        country: result.country,
      }
    });

    console.log('✅ Address processed:', {
      timestamp: new Date().toISOString(),
      addressId: address.id,
      validationStatus: isValid ? 'VALID' : 'INVALID',
      residential: result.residential,
      verificationDetails: result.verifications
    });

    return NextResponse.json({ 
      success: true,
      data: {
        valid: isValid,
        residential: result.residential,
        verifications: result.verifications
      }
    });
  } catch (error) {
    console.error('🚨 EasyPost error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
} 