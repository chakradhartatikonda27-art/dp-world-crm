import { User, UserRole, Permission } from '@/types';
import { ROLE_PERMISSIONS } from './constants';
import { db } from './db';

export interface AuthSession {
  user: User;
  organizationId: string;
}

export function getSessionFromHeaders(headers: Record<string, string | string[] | undefined>): AuthSession {
  // Extract tenant context from Authorization header or custom header
  const orgIdHeader = headers['x-organization-id'] as string;
  const roleHeader = headers['x-user-role'] as UserRole;
  const emailHeader = headers['x-user-email'] as string;

  // Default to Org 1 (Apex Global Logistics) if unspecified for API queries
  const targetOrgId = orgIdHeader || 'org-apex-001';
  const targetRole: UserRole = roleHeader || 'ORG_ADMIN';

  const user = db.users.find(u => u.organizationId === targetOrgId && u.role === targetRole) || {
    id: 'usr-default',
    organizationId: targetOrgId,
    email: emailHeader || 'admin@apexlogistics.com',
    firstName: 'Default',
    lastName: 'Admin',
    phone: '+1 555-0000',
    role: targetRole,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  return {
    user,
    organizationId: targetOrgId,
  };
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function enforceTenantAccess<T extends { organizationId: string }>(session: AuthSession, entity: T): void {
  if (entity.organizationId !== session.organizationId) {
    throw new Error(`TENANT_ACCESS_DENIED: Organization ${session.organizationId} cannot access entity owned by ${entity.organizationId}`);
  }
}
