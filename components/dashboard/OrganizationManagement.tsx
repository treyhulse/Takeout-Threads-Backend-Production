"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateOrganization } from "@/lib/kinde/actions/organization";

interface OrganizationDetails {
  name?: string;
  theme_code?: 'light' | 'dark' | 'user_preference';
  handle?: string;
}

const OrganizationManagement: React.FC<{ orgDetails: OrganizationDetails; orgCode: string }> = ({ 
  orgDetails, 
  orgCode 
}) => {
  const [formData, setFormData] = useState({
    name: orgDetails.name || '',
    theme_code: orgDetails.theme_code || 'light',
    handle: orgDetails.handle || '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateOrganization(orgCode, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Organization settings updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating organization:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update organization",
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
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle">Organization Handle</Label>
            <Input
              id="handle"
              value={formData.handle}
              onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme_code">Theme</Label>
            <select
              id="theme_code"
              value={formData.theme_code}
              onChange={(e) => setFormData(prev => ({ ...prev, theme_code: e.target.value as 'light' | 'dark' | 'user_preference' }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="user_preference">User Preference</option>
            </select>
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
