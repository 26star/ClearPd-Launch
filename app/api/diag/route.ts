import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return NextResponse.json({
    runtime: 'nodejs',
    node_version: process.version,
    supabase_url_set: !!url,
    supabase_url_length: url?.length ?? 0,
    supabase_url_starts_https: url?.startsWith('https://') ?? false,
    service_key_set: !!key,
    service_key_length: key?.length ?? 0,
    service_key_starts_eyJ: key?.startsWith('eyJ') ?? false,
    vercel_env: process.env.VERCEL_ENV ?? null,
    vercel_url: process.env.VERCEL_URL ?? null,
  })
}
