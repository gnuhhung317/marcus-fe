'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  createCurrentUserApiKey,
  deleteCurrentUserApiKey,
  updateCurrentUserPreferences,
  updateCurrentUserProfile,
} from '../../../lib/contracts/client';

function toBool(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true' || value === '1';
}

function toSessionTimeout(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) {
    return 30;
  }

  return Math.max(5, Math.min(240, parsed));
}

export async function updatePreferencesAction(formData: FormData) {
  const timezone = String(formData.get('timezone') ?? '').trim() || 'UTC+7';
  const baseCurrency = String(formData.get('baseCurrency') ?? '').trim().toUpperCase() || 'USD';
  const emailNotifications = toBool(formData.get('emailNotifications'));
  const sessionTimeoutMinutes = toSessionTimeout(formData.get('sessionTimeoutMinutes'));

  try {
    await updateCurrentUserPreferences({
      timezone,
      baseCurrency,
      emailNotifications,
      sessionTimeoutMinutes,
    });

    revalidatePath('/terminal/profile');
    redirect('/terminal/profile?status=preferences_updated');
  } catch {
    redirect('/terminal/profile?status=preferences_failed');
  }
}

export async function createApiKeyAction(formData: FormData) {
  const label = String(formData.get('label') ?? '').trim() || `Terminal_Key_${new Date().getTime()}`;

  try {
    await createCurrentUserApiKey({ label });
    revalidatePath('/terminal/profile');
    redirect('/terminal/profile?status=apikey_created');
  } catch {
    redirect('/terminal/profile?status=apikey_create_failed');
  }
}

export async function revokeApiKeyAction(formData: FormData) {
  const apiKeyId = String(formData.get('apiKeyId') ?? '').trim();

  if (!apiKeyId) {
    redirect('/terminal/profile?status=apikey_revoke_failed');
  }

  try {
    await deleteCurrentUserApiKey(apiKeyId);
    revalidatePath('/terminal/profile');
    redirect('/terminal/profile?status=apikey_revoked');
  } catch {
    redirect('/terminal/profile?status=apikey_revoke_failed');
  }
}

export async function updateProfileAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();

  if (!username && !email) {
    redirect('/terminal/profile?status=profile_failed');
  }

  try {
    await updateCurrentUserProfile({
      ...(username && { username }),
      ...(email && { email }),
    });

    revalidatePath('/terminal/profile');
    redirect('/terminal/profile?status=profile_updated');
  } catch {
    redirect('/terminal/profile?status=profile_failed');
  }
}