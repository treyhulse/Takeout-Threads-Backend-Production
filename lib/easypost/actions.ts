'use server';

import { easypost } from './config';

type AddressVerificationParams = {
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  name?: string | null;
  customer_id: string;
};

export async function verifyAddress(params: AddressVerificationParams) {
  try {
    // Remove customer_id from EasyPost params
    const { customer_id, ...addressParams } = params;
    
    const verifiedAddress = await easypost.Address.create({
      ...addressParams,
      verify: true,
    });

    return {
      success: true,
      data: verifiedAddress,
      error: null
    };
  } catch (error) {
    console.error('EasyPost verification error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to verify address'
    };
  }
} 