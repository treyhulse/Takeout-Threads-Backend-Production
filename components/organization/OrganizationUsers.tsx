"use client";

import { useState, useEffect, useCallback } from "react";
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
import { createOrganizationUser, getUserRoles, addUserRole, removeUserRole } from "@/lib/kinde/actions/organization";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Settings2 } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_ROLES, ROLES } from '@/constants/roles';
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

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

interface UserRole {
  id: string;
  key: string;
  name: string;
}

interface UserRolesResponse {
  success: boolean;
  data?: {
    roles: UserRole[];
  };
  error?: string;
}

interface AvailableRole {
  id: string;
  key: string;
  name: string;
}

interface RoleChangeConfirmation {
  isOpen: boolean;
  userId: string;
  roleKey: string;
  isRemoving: boolean;
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
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({});
  const [availableRoles] = useState(AVAILABLE_ROLES);
  const [roleConfirmation, setRoleConfirmation] = useState<RoleChangeConfirmation>({
    isOpen: false,
    userId: '',
    roleKey: '',
    isRemoving: false
  });
  const [isRoleChanging, setIsRoleChanging] = useState(false);

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

  const fetchUserRoles = useCallback(async (userId: string) => {
    const result = await getUserRoles(orgCode, userId);
    if (result.success && result.data) {
      setUserRoles(prev => ({
        ...prev,
        [userId]: result.data.roles
      }));
    }
  }, [orgCode]);

  const handleRoleToggleClick = (userId: string, roleKey: string, currentlyHasRole: boolean) => {
    setRoleConfirmation({
      isOpen: true,
      userId,
      roleKey,
      isRemoving: currentlyHasRole
    });
  };

  const handleRoleConfirm = async () => {
    const { userId, roleKey, isRemoving } = roleConfirmation;
    setIsRoleChanging(true);
    
    try {
      const roleId = ROLES[roleKey as keyof typeof ROLES].id;
      let result;
      
      if (isRemoving) {
        result = await removeUserRole(orgCode, userId, roleId);
      } else {
        result = await addUserRole(orgCode, userId, roleId);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Role ${isRemoving ? 'removed' : 'added'} successfully`,
        });
        await fetchUserRoles(userId);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update role: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      // Add a slight delay before closing for better UX
      setTimeout(() => {
        setIsRoleChanging(false);
        setRoleConfirmation(prev => ({ ...prev, isOpen: false }));
      }, 1000);
    }
  };

  const hasRole = (userId: string, roleKey: string) => {
    return userRoles[userId]?.some(role => role.key === roleKey) || false;
  };

  useEffect(() => {
    users.forEach(user => {
      fetchUserRoles(user.id);
    });
  }, [users, fetchUserRoles]);

  return (
    <>
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
                <div className="flex items-center justify-end space-x-8">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${user.id}-admin-role`}
                      checked={hasRole(user.id, 'admin')}
                      onCheckedChange={() => 
                        handleRoleToggleClick(user.id, 'ADMIN', hasRole(user.id, 'admin'))
                      }
                    />
                    <Label htmlFor={`${user.id}-admin-role`}>Administrator</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${user.id}-member-role`}
                      checked={hasRole(user.id, 'member')}
                      onCheckedChange={() => 
                        handleRoleToggleClick(user.id, 'MEMBER', hasRole(user.id, 'member'))
                      }
                    />
                    <Label htmlFor={`${user.id}-member-role`}>Member</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog 
        open={roleConfirmation.isOpen} 
        onOpenChange={(isOpen) => 
          setRoleConfirmation(prev => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleConfirmation.isRemoving ? 'Remove Role' : 'Add Role'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {roleConfirmation.isRemoving ? 'remove' : 'add'} the{' '}
              {ROLES[roleConfirmation.roleKey as keyof typeof ROLES]?.name} role
              {roleConfirmation.isRemoving ? ' from' : ' to'} this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRoleChanging}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRoleConfirm();
              }}
              disabled={isRoleChanging}
            >
              {isRoleChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 