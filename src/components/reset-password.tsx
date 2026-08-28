"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input } from "./ui";
export function ResetPassword() {
  const router = useRouter();
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password"));
    const client = createClient();
    if (!client) return router.push("/dashboard");
    const result = await client.auth.updateUser({ password });
    if (result.error) return setError(result.error.message);
    router.push("/dashboard");
  };
  return (
    <Card className="mx-auto w-full max-w-md p-7 shadow-2xl">
      <span className="mx-auto grid size-10 place-items-center rounded-xl bg-primary font-semibold text-primary-foreground">
        N
      </span>
      <h1 className="mt-5 text-center text-2xl font-semibold">
        Choose a new password
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Use at least eight characters and avoid reused passwords.
      </p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-medium">
          New password
          <Input
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-2"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            {error}
          </p>
        )}
        <Button className="w-full" type="submit">
          Update password
        </Button>
      </form>
    </Card>
  );
}
