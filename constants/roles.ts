export const ROLES = {
  ADMIN: {
    id: '0194dd3a-494d-156b-df25-a5ad85a92cd5',
    key: 'admin',
    name: 'Administrator'
  },
  MEMBER: {
    id: '0194dd3a-e3d3-85b7-752a-f8778531e1bc',
    key: 'member',
    name: 'Member'
  }
} as const;

// Helper array for mapping through available roles
export const AVAILABLE_ROLES = Object.values(ROLES);

// Type for role keys
export type RoleKey = keyof typeof ROLES;

// Interface for role structure
export interface Role {
  id: string;
  key: string;
  name: string;
}
