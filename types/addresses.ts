export type Address = {
  id: string;
  address_id: string;
  org_id: string;
  customer_id: string;
  easypost_id?: string | null;
  name?: string | null;
  company?: string | null;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone?: string | null;
  email?: string | null;
  verified: boolean;
  latitude?: number | null;
  longitude?: number | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateAddressPayload = {
  customer_id: string;
  name?: string | null;
  company?: string | null;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  country: string;
  zip: string;
  verified?: boolean;
};

export type UpdateAddressPayload = Partial<CreateAddressPayload>; 