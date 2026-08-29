"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Input } from "./ui";
import { GitBranch, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
    [error, setError] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const callback = new URL("/auth/callback", location.origin);
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
              redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
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
  const oauth = async () => {
    setError("");
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError(
        "Authentication is temporarily unavailable. Please try again later.",
      );
      return;
    }
    const callback = new URL("/auth/callback", location.origin);
    callback.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callback.toString() },
    });
    if (error) setError(error.message);
  };
  return (
    <Card className="w-full max-w-md p-7 shadow-2xl">
      <div className="mb-7 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-xl bg-primary font-semibold text-primary-foreground">
          N
        </span>
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
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={oauth}
          >
            <GitBranch className="size-4" />
            Continue with GitHub
          </Button>
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
