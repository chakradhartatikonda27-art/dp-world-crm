'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Permission } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/constants';

interface AuthContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentOrgId: string;
  setCurrentOrgId: (orgId: string) => void;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  canAccessRoute: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentRole: 'ORG_ADMIN',
  setCurrentRole: () => {},
  currentOrgId: 'org-dpw-rwanda',
  setCurrentOrgId: () => {},
  permissions: [],
  hasPermission: () => true,
  canAccessRoute: () => true,
});

// Role to route mapping rules
const ROLE_ROUTE_ACCESS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  ORG_ADMIN: ['*'],
  OPERATIONS_MANAGER: [
    '/', '/shipments', '/tracking', '/drivers', '/routes', '/loading', '/warehouse',
    '/documents', '/pod', '/automation', '/ai', '/exceptions', '/analytics', '/productivity', '/invoices'
  ],
  OPERATIONS_EXECUTIVE: [
    '/', '/shipments', '/tracking', '/drivers', '/routes', '/loading', '/documents', '/pod', '/exceptions'
  ],
  FLEET_MANAGER: [
    '/', '/fleet', '/drivers', '/routes', '/fuel', '/maintenance', '/loading', '/tracking', '/analytics', '/productivity'
  ],
  DISPATCHER: [
    '/', '/shipments', '/tracking', '/driver', '/drivers', '/routes', '/loading', '/exceptions'
  ],
  DRIVER: [
    '/', '/driver', '/shipments', '/tracking', '/pod'
  ],
  WAREHOUSE_MANAGER: [
    '/', '/warehouse', '/loading', '/shipments', '/tracking', '/documents', '/pod', '/exceptions'
  ],
  WAREHOUSE_OPERATOR: [
    '/', '/warehouse', '/loading', '/shipments', '/pod'
  ],
  FINANCE_MANAGER: [
    '/', '/invoices', '/quotes', '/clients', '/vendors', '/fuel', '/productivity', '/analytics', '/documents'
  ],
  FINANCE_EXECUTIVE: [
    '/', '/invoices', '/quotes', '/clients', '/vendors', '/documents'
  ],
  CUSTOMER_ADMIN: [
    '/', '/customer', '/shipments', '/tracking', '/invoices', '/quotes', '/pod'
  ],
  CUSTOMER_USER: [
    '/', '/customer', '/shipments', '/tracking', '/pod'
  ],
  MANAGEMENT_VIEWER: [
    '/', '/analytics', '/productivity', '/shipments', '/tracking', '/fleet', '/drivers', '/invoices', '/audit'
  ],
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  initialRole?: UserRole;
  initialOrgId?: string;
}> = ({ children, initialRole = 'ORG_ADMIN', initialOrgId = 'org-dpw-rwanda' }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [currentOrgId, setCurrentOrgId] = useState<string>(initialOrgId);

  // Sync role state with localStorage for persistence across reloads
  useEffect(() => {
    const savedRole = localStorage.getItem('logistics_os_user_role') as UserRole;
    const savedOrg = localStorage.getItem('logistics_os_org_id');
    if (savedRole) setCurrentRole(savedRole);
    if (savedOrg) setCurrentOrgId(savedOrg);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('logistics_os_user_role', role);
  };

  const handleOrgChange = (orgId: string) => {
    setCurrentOrgId(orgId);
    localStorage.setItem('logistics_os_org_id', orgId);
  };

  const permissions = ROLE_PERMISSIONS[currentRole] || [];

  const hasPermission = (permission: Permission): boolean => {
    if (currentRole === 'SUPER_ADMIN' || currentRole === 'ORG_ADMIN') return true;
    return permissions.includes(permission);
  };

  const canAccessRoute = (route: string): boolean => {
    const allowed = ROLE_ROUTE_ACCESS[currentRole] || ['*'];
    if (allowed.includes('*')) return true;
    return allowed.includes(route);
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleRoleChange,
        currentOrgId,
        setCurrentOrgId: handleOrgChange,
        permissions,
        hasPermission,
        canAccessRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
