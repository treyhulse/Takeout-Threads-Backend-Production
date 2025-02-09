// kindeActions.ts
// This module exports functions for all the Kinde organization-related actions.
// It leverages the kindeApiFetch() function from kindeApiClient.ts.

import { kindeApiFetch } from "./kindeApiClient";

// Organization actions

/**
 * Retrieves details for a specific organization.
 * GET /organization?code=<orgCode>
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
 * Retrieves all organizations.
 * GET /organizations
 */
export async function getOrganizations() {
  return kindeApiFetch(`/organizations`);
}

/**
 * Updates a specific organization.
 * PATCH /organization?code=<orgCode>
 * Expects a JSON body with the properties to update.
 */
export async function updateOrganization(orgCode: string, updates: Record<string, any>) {
  return kindeApiFetch(`/organization?code=${orgCode}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/**
 * Deletes a specific organization.
 * DELETE /organization?code=<orgCode>
 */
export async function deleteOrganization(orgCode: string) {
  return kindeApiFetch(`/organization?code=${orgCode}`, {
    method: "DELETE",
  });
}

// Logo actions

/**
 * Reads the organization logo.
 * GET /organization/logo?code=<orgCode>
 */
export async function readOrganizationLogo(orgCode: string) {
  return kindeApiFetch(`/organization/logo?code=${orgCode}`);
}

/**
 * Adds or updates the organization logo.
 * POST /organization/logo
 * Expects a JSON body with { code: orgCode, logo: logoData }
 */
export async function addOrganizationLogo(orgCode: string, logoData: string) {
  return kindeApiFetch(`/organization/logo`, {
    method: "POST",
    body: JSON.stringify({ code: orgCode, logo: logoData }),
  });
}

/**
 * Deletes the organization logo.
 * DELETE /organization/logo?code=<orgCode>
 */
export async function deleteOrganizationLogo(orgCode: string) {
  return kindeApiFetch(`/organization/logo?code=${orgCode}`, {
    method: "DELETE",
  });
}

// Organization users actions

/**
 * Retrieves all users of an organization.
 * GET /organization/users?code=<orgCode>
 */
export async function getOrganizationUsers(orgCode: string) {
  return kindeApiFetch(`/organization/users?code=${orgCode}`);
}

/**
 * Invites (adds) a user to an organization by email.
 * POST /organization/users
 * Expects a JSON body with { code: orgCode, email: userEmail }
 */
export async function addOrganizationUser(orgCode: string, email: string) {
  return kindeApiFetch(`/organization/users`, {
    method: "POST",
    body: JSON.stringify({ code: orgCode, email }),
  });
}

/**
 * Updates a user's role or information within an organization.
 * PATCH /organization/users
 * Expects a JSON body with { code: orgCode, userId, ...updates }
 */
export async function updateOrganizationUser(
  orgCode: string,
  userId: string,
  updates: Record<string, any>
) {
  return kindeApiFetch(`/organization/users`, {
    method: "PATCH",
    body: JSON.stringify({ code: orgCode, userId, ...updates }),
  });
}
