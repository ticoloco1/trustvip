import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route handles the magic link redirect from Supabase
// Supabase sends: /auth/callback?code=xxx OR #access_token=xxx
// We exchange the code for a session and redirect to dashboard

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/dashboard';
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  // If Supabase returned an error
  if (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Success — redirect to dashboard
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Fallback: redirect to login with a message
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('message', 'Link inválido ou expirado. Tente novamente.');
  return NextResponse.redirect(loginUrl);
}
