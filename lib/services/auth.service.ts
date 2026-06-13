import { requestAuthJson, AuthRefreshRequest } from '@/lib/api/http';
import {
  RegisterUserInput,
} from '@/lib/contracts/types';
import { mapAuthSession } from '@/lib/services/base.service';

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export async function loginWithCredentials(payload: AuthLoginRequest) {
  const response = await requestAuthJson('/auth/login', payload);
  return mapAuthSession(response);
}

export async function refreshWithToken(payload: AuthRefreshRequest) {
  const response = await requestAuthJson('/auth/refresh', payload);
  return mapAuthSession(response);
}

export async function registerWithCredentials(payload: RegisterUserInput) {
  const response = await requestAuthJson('/auth/register', payload);
  return mapAuthSession(response);
}
