import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
export async function GET(request: Request) {
  const url = new URL(request.url),
    code = url.searchParams.get("code"),
    next = safeRedirectPath(url.searchParams.get("next"));
  if (code) {
    const client = await createClient();
    if (!client) {
      return NextResponse.redirect(
        new URL("/login?error=configuration", url.origin),
      );
    }
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(
    new URL("/login?error=auth_callback", url.origin),
  );
}
