"use server"

import EasyPost from "@easypost/api"
import { Address } from "@/types/addresses"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { createAddress } from "@/lib/supabase/addresses"

// Initialize EasyPost with your API key
const easypost = new EasyPost(process.env.EASYPOST_API_KEY!)

export async function verifyAddress(addressData: Partial<Address>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // Create an address verification request
    const verificationResult = await easypost.Address.createAndVerify({
      street1: addressData.street1,
      street2: addressData.street2,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      country: addressData.country,
      company: addressData.company,
      name: addressData.name,
    })

    // If verification successful, save to database
    if (verificationResult.verifications?.delivery?.success) {
      const addressToSave = {
        ...addressData,
        org_id: org.orgCode,
        easypost_id: verificationResult.id,
        verified: true,
        coordinates: {
          latitude: verificationResult.latitude,
          longitude: verificationResult.longitude,
        }
      }

      const { data: savedAddress, error } = await createAddress(addressToSave)
      if (error) throw new Error(error)

      return {
        verified: true,
        suggestions: [savedAddress],
      }
    }

    // If verification suggests alternatives
    if (verificationResult.verifications?.delivery?.details?.suggestions) {
      const suggestions = await Promise.all(
        verificationResult.verifications.delivery.details.suggestions.map(
          async (suggestion: any) => {
            const addressToSave = {
              ...addressData,
              org_id: org.orgCode,
              easypost_id: suggestion.id,
              street1: suggestion.street1,
              street2: suggestion.street2,
              city: suggestion.city,
              state: suggestion.state,
              zip: suggestion.zip,
              country: suggestion.country,
              verified: true,
              coordinates: {
                latitude: suggestion.latitude,
                longitude: suggestion.longitude,
              }
            }

            const { data: savedAddress, error } = await createAddress(addressToSave)
            if (error) throw new Error(error)
            return savedAddress
          }
        )
      )

      return {
        verified: true,
        suggestions,
      }
    }

    return {
      verified: false,
      error: "Unable to verify address"
    }
  } catch (error) {
    console.error("Error verifying address:", error)
    throw error
  }
} 