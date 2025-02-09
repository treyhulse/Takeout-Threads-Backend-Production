"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrganizationUser } from "@/lib/kinde/kindeActions";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import Image from "next/image";



interface OrganizationUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: string;
  joined_on: string;
  roles?: string[];
}

interface OrganizationUsersProps {
  users: OrganizationUser[];
  orgCode: string;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
}

const initialFormData: UserFormData = {
  first_name: "",
  last_name: "",
  email: "",
};

export function OrganizationUsers({ users, orgCode }: OrganizationUsersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleCreateUser triggered');
    setIsLoading(true);

    try {
      const result = await createOrganizationUser(orgCode, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });
      
      if (result.success) {
        console.log('Create user success response:', result.data);
        toast({
          title: "Success",
          description: `User ${formData.email} has been created and added to the organization`,
        });
        setIsOpen(false);
        setFormData(initialFormData);
        // You might want to refresh the users list here
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Create user error:', error);
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClick = () => {
    console.log('Submit button clicked');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Organization Users</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form 
              onSubmit={handleCreateUser} 
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleSubmitClick}
              >
                {isLoading ? "Creating User..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {users?.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {user.picture && (
                  <Image 
                    src={user.picture} 
                    alt={`${user.first_name} ${user.last_name}`} 
                    className="h-10 w-10 rounded-full"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end text-sm text-muted-foreground">
                <p>Joined: {new Date(user.joined_on).toLocaleDateString()}</p>
                <p>Roles: {user.roles?.join(", ") || "None"}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 