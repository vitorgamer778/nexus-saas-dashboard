"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Input } from "./ui";
import { GitBranch, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NexusMark } from "./nexus-mark";
import { getAuthOrigin } from "@/lib/site-url";
export function AuthCard({
  mode,
  next = "/dashboard",
  message,
}: {
  mode: "login" | "register" | "forgot";
  next?: string;
  message?: string;
}) {
  const router = useRouter(),
    [loading, setLoading] = useState(false),
    [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
      null,
    ),
    [error, setError] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const authOrigin = getAuthOrigin(location.origin);
    if (!authOrigin) {
      setError("Authentication redirect configuration is invalid.");
      setLoading(false);
      return;
    }
    const callback = new URL("/auth/callback", authOrigin);
    callback.searchParams.set(
      "next",
      mode === "register" ? "/onboarding" : next,
    );
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError(
        "Authentication is temporarily unavailable. Please try again later.",
      );
      setLoading(false);
      return;
    }
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === "register"
          ? await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: callback.toString() },
            })
          : await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${authOrigin}/auth/callback?next=/reset-password`,
            });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }
    router.push(
      mode === "register"
        ? "/onboarding"
        : mode === "forgot"
          ? "/login?reset=sent"
          : next,
    );
  };
  const oauth = async (provider: "google" | "github") => {
    setError("");
    setOauthLoading(provider);
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError(
        "Authentication is temporarily unavailable. Please try again later.",
      );
      setOauthLoading(null);
      return;
    }
    const authOrigin = getAuthOrigin(location.origin);
    if (!authOrigin) {
      setError("Authentication redirect configuration is invalid.");
      setOauthLoading(null);
      return;
    }
    const callback = new URL("/auth/callback", authOrigin);
    callback.searchParams.set(
      "next",
      mode === "register" ? "/onboarding" : next,
    );
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callback.toString() },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };
  return (
    <Card className="w-full max-w-md p-7 shadow-2xl">
      <div className="mb-7 text-center">
        <NexusMark className="mx-auto size-10" />
        <h1 className="mt-5 text-2xl font-semibold">
          {mode === "login"
            ? "Welcome back"
            : mode === "register"
              ? "Create your account"
              : "Reset your password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We’ll send a secure reset link to your inbox."
            : "Continue to your Nexus workspace."}
        </p>
      </div>
      {message && (
        <p className="mb-5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          {message}
        </p>
      )}
      {mode !== "forgot" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => oauth("google")}
            >
              {oauthLoading === "google" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <GoogleMark />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => oauth("github")}
            >
              {oauthLoading === "github" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <GitBranch className="size-4" />
              )}
              GitHub
            </Button>
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">
          Email address
          <Input
            className="mt-2"
            type="email"
            name="email"
            required
            placeholder="you@company.com"
          />
        </label>
        {mode !== "forgot" && (
          <label className="block text-sm font-medium">
            Password
            <Input
              className="mt-2"
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </label>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            {error}
          </p>
        )}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : mode === "login" ? (
            "Sign in"
          ) : mode === "register" ? (
            "Create account"
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            New to Nexus?{" "}
            <Link className="font-medium text-primary" href="/register">
              Create account
            </Link>
          </>
        ) : mode === "register" ? (
          <>
            Already a member?{" "}
            <Link className="font-medium text-primary" href="/login">
              Sign in
            </Link>
          </>
        ) : (
          <Link className="font-medium text-primary" href="/login">
            Back to sign in
          </Link>
        )}
      </p>
      {mode === "login" && (
        <Link
          href="/forgot-password"
          className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary"
        >
          Forgot your password?
        </Link>
      )}
    </Card>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.3L6.5 14Z"
      />
      <path
        fill="#EA4335"
        d="M12 6a5.4 5.4 0 0 1 3.8 1.5l2.9-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z"
      />
    </svg>
  );
}
