"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateOrganizationProperties } from "@/lib/kinde/actions/organization";

interface OrganizationDetails {
  properties?: {
    org_city: string;
    org_country: string;
    org_industry: string;
    org_postcode: string;
    org_state_region: string;
    org_street_address: string;
    org_street_address_2: string;
  }
}

const defaultProperties = {
  org_city: "",
  org_country: "",
  org_industry: "",
  org_postcode: "",
  org_state_region: "",
  org_street_address: "",
  org_street_address_2: "",
};

const OrganizationManagement: React.FC<{ orgDetails: OrganizationDetails; orgCode: string }> = ({ 
  orgDetails, 
  orgCode 
}) => {
  const [formData, setFormData] = useState(orgDetails.properties || defaultProperties);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (orgDetails.properties) {
      setFormData(orgDetails.properties);
    }
  }, [orgDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateOrganizationProperties(orgCode, formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Organization properties updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating properties:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update organization properties",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org_street_address">Street Address</Label>
              <Input
                id="org_street_address"
                value={formData.org_street_address}
                onChange={(e) => setFormData(prev => ({ ...prev, org_street_address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_street_address_2">Street Address 2</Label>
              <Input
                id="org_street_address_2"
                value={formData.org_street_address_2}
                onChange={(e) => setFormData(prev => ({ ...prev, org_street_address_2: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_city">City</Label>
              <Input
                id="org_city"
                value={formData.org_city}
                onChange={(e) => setFormData(prev => ({ ...prev, org_city: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_state_region">State/Region</Label>
              <Input
                id="org_state_region"
                value={formData.org_state_region}
                onChange={(e) => setFormData(prev => ({ ...prev, org_state_region: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_postcode">Postal Code</Label>
              <Input
                id="org_postcode"
                value={formData.org_postcode}
                onChange={(e) => setFormData(prev => ({ ...prev, org_postcode: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_country">Country</Label>
              <Input
                id="org_country"
                value={formData.org_country}
                onChange={(e) => setFormData(prev => ({ ...prev, org_country: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org_industry">Industry</Label>
              <Input
                id="org_industry"
                value={formData.org_industry}
                onChange={(e) => setFormData(prev => ({ ...prev, org_industry: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default OrganizationManagement;
