import { NextResponse } from 'next/server';

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const body = await response.json().catch(() => ({}));
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: 'Registration service is not available yet. Please contact support or use an existing account.' },
      { status: 503 }
    );
  }
}
