export enum Role {
  // Primary Roles
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CITIZEN = 'CITIZEN',

  // Functional Roles (for ADMIN only)
  REGISTRAR = 'REGISTRAR',
  VERIFIER = 'VERIFIER',
  APPROVER = 'APPROVER',
  VIEWER = 'VIEWER'
} 