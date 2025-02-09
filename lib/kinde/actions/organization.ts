'use server'

// kindeActions.ts
// This module exports functions for all the Kinde organization-related actions.
// It leverages the kindeApiFetch() function from kindeApiClient.ts.

import { kindeApiFetch } from "@/lib/kinde/kindeApiClient";

// Organization actions

/**
 * Retrieves details for a specific organization.
 * GET /api/v1/organization?code=<orgCode>
 */
export async function getOrganization(orgCode: string) {
  return kindeApiFetch(`/organization?code=${orgCode}`);
}

/**
 * Creates a new organization.
 * POST /organization
 * Expects a JSON body with at least an "orgName" property (and optionally other properties).
 */
export async function createOrganization(orgName: string, properties?: Record<string, any>) {
  return kindeApiFetch(`/organization`, {
    method: "POST",
    body: JSON.stringify({ orgName, ...properties }),
  });
}

/**
 * Delete an organization
 * DELETE /api/v1/organization/{org_code}
 */
export async function deleteOrganization(orgCode: string) {
  try {
    const response = await kindeApiFetch(`/organization/${orgCode}`, {
      method: 'DELETE',
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Delete Organization Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Updates an organization's details
 * PATCH /api/v1/organization/{org_code}
 */
export async function updateOrganization(
  orgCode: string,
  updateData: {
    name?: string;
    theme_code?: 'light' | 'dark' | 'user_preference';
    handle?: string;
  }
) {
  try {
    const response = await kindeApiFetch(`/organization/${orgCode}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Update Organization Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Organization users actions

/**
 * Retrieves all users of an organization.
 * GET /api/v1/organizations/{org_code}/users
 */
export async function getOrganizationUsers(orgCode: string) {
  return kindeApiFetch(`/organizations/${orgCode}/users`);
}

/**
 * Creates a new user in Kinde and adds them to an organization
 * POST /api/v1/user
 */
export async function createOrganizationUser(orgCode: string, userData: {
  first_name: string;
  last_name: string;
  email: string;
}) {
  const requestBody = {
    profile: {
      given_name: userData.first_name,
      family_name: userData.last_name,
    },
    organization_code: orgCode,
    identities: [
      {
        type: "email",
        details: {
          email: userData.email
        }
      }
    ]
  };

  console.log('Create User Request:', {
    url: '/user',
    method: 'POST',
    body: requestBody
  });

  try {
    const response = await kindeApiFetch(`/user`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    
    console.log('Create User Response:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Create User Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Retrieves roles for a specific user in an organization
 * GET /api/v1/organizations/{org_code}/users/{user_id}/roles
 */
export async function getUserRoles(orgCode: string, userId: string) {
  try {
    const response = await kindeApiFetch(`/organizations/${orgCode}/users/${userId}/roles`);
    return { success: true, data: response };
  } catch (error) {
    console.error('Get User Roles Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Assigns a role to a user in an organization
 * POST /api/v1/organizations/{org_code}/users/{user_id}/roles
 */
export async function addUserRole(orgCode: string, userId: string, roleId: string) {
  try {
    const response = await kindeApiFetch(
      `/organizations/${orgCode}/users/${userId}/roles`,
      {
        method: "POST",
        body: JSON.stringify({ role_id: roleId }),
      }
    );
    return { success: true, data: response };
  } catch (error) {
    console.error('Add User Role Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Removes a role from a user in an organization
 * DELETE /api/v1/organizations/{org_code}/users/{user_id}/roles/{role_id}
 */
export async function removeUserRole(orgCode: string, userId: string, roleId: string) {
  try {
    const response = await kindeApiFetch(
      `/organizations/${orgCode}/users/${userId}/roles/${roleId}`,
      {
        method: "DELETE",
      }
    );
    return { success: true, data: response };
  } catch (error) {
    console.error('Remove User Role Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get organization properties
 * GET /api/v1/organizations/{org_code}/properties
 */
export async function getOrganizationProperties(orgCode: string) {
  try {
    const response = await kindeApiFetch(`/organizations/${orgCode}/properties`);
    return { success: true, data: response };
  } catch (error) {
    console.error('Get Organization Properties Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

