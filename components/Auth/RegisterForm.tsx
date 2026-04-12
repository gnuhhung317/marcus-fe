"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.message || 'Registration failed')
      }
      // On success, redirect to terminal for onboarding
      router.push('/terminal?onboard=true')
    } catch (err: any) {
      setError(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {error && <div className="rounded-lg border border-[rgba(244,63,94,0.4)] bg-[rgba(127,29,29,0.35)] p-3 text-sm text-red-100">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-white">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Display name</label>
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} type="text" required className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={8} className="mt-1 block w-full rounded-md border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-3 py-2 text-white shadow-sm outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.52)]" />
        <p className="mt-1 text-xs text-muted">Use at least 8 characters.</p>
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </div>
      <p className="text-xs text-muted">By creating an account, you agree to system access and audit policies.</p>
    </form>
  )
}
