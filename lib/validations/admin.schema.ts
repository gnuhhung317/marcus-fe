import { z } from 'zod';
import type { AdminBotStatus, AdminUserRole } from '@/lib/contracts/types';

export const ADMIN_USER_ROLES = ['ADMIN', 'TRADER', 'DEVELOPER'] as const;
export const ADMIN_ASSIGNABLE_USER_ROLES = ['TRADER', 'DEVELOPER'] as const;
export const ADMIN_BOT_STATUSES = ['ACTIVE', 'PAUSED', 'DOWN', 'DELETED'] as const;

export type AdminAssignableUserRole = (typeof ADMIN_ASSIGNABLE_USER_ROLES)[number];

export const adminUserRoleSchema = z.enum(ADMIN_USER_ROLES);
export const adminAssignableUserRoleSchema = z.enum(ADMIN_ASSIGNABLE_USER_ROLES);
export const adminBotStatusSchema = z.enum(ADMIN_BOT_STATUSES);

export interface AdminUsersSearchParams {
  query?: string | string[];
  role?: string | string[];
  banned?: string | string[];
  page?: string | string[];
  size?: string | string[];
}

export interface AdminBotsSearchParams {
  query?: string | string[];
  status?: string | string[];
  developerId?: string | string[];
  page?: string | string[];
  size?: string | string[];
}

export interface AdminUsersQueryParams {
  query?: string;
  role?: AdminUserRole;
  banned?: boolean;
  page: number;
  size: number;
}

export interface AdminBotsQueryParams {
  query?: string;
  status?: AdminBotStatus;
  developerId?: string;
  page: number;
  size: number;
}

export interface AdminBotDetailQueryParams {
  signalsLimit: number;
  subscribersPageSize: number;
  auditPageSize: number;
}

function firstValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseNonNegativeInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function isAdminUserRole(value: string): value is AdminUserRole {
  return value === 'ADMIN' || value === 'TRADER' || value === 'DEVELOPER';
}

export function isAssignableAdminUserRole(value: string): value is (typeof ADMIN_ASSIGNABLE_USER_ROLES)[number] {
  return value === 'TRADER' || value === 'DEVELOPER';
}

export function isAdminBotStatus(value: string): value is AdminBotStatus {
  return value === 'ACTIVE' || value === 'PAUSED' || value === 'DOWN' || value === 'DELETED';
}

export function normalizeAdminUsersQueryParams(searchParams?: AdminUsersSearchParams): AdminUsersQueryParams {
  const query = firstValue(searchParams?.query)?.trim() || undefined;
  const roleValue = firstValue(searchParams?.role);
  const bannedValue = firstValue(searchParams?.banned);

  return {
    query,
    role: roleValue && isAdminUserRole(roleValue) ? roleValue : undefined,
    banned: bannedValue === 'true' ? true : bannedValue === 'false' ? false : undefined,
    page: parseNonNegativeInt(firstValue(searchParams?.page), 0),
    size: parsePositiveInt(firstValue(searchParams?.size), 20),
  };
}

export function normalizeAdminBotsQueryParams(searchParams?: AdminBotsSearchParams): AdminBotsQueryParams {
  const query = firstValue(searchParams?.query)?.trim() || undefined;
  const statusValue = firstValue(searchParams?.status);
  const developerId = firstValue(searchParams?.developerId)?.trim() || undefined;

  return {
    query,
    status: statusValue && isAdminBotStatus(statusValue) ? statusValue : undefined,
    developerId,
    page: parseNonNegativeInt(firstValue(searchParams?.page), 0),
    size: parsePositiveInt(firstValue(searchParams?.size), 20),
  };
}

export function normalizeAdminBotDetailQueryParams() {
  return {
    signalsLimit: 50,
    subscribersPageSize: 50,
    auditPageSize: 50,
  };
}
