import { AuthCard } from "@/components/auth-card";
import { safeRedirectPath } from "@/lib/safe-redirect";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const message =
    params.error === "configuration"
      ? "Authentication is temporarily unavailable. Please try again later."
      : params.error
        ? "We could not complete authentication. Please try again."
        : params.reset === "sent"
          ? "Check your inbox for a secure password reset link."
          : undefined;
  return (
    <div className="flex justify-center">
      <AuthCard
        mode="login"
        next={safeRedirectPath(params.next)}
        message={message}
      />
    </div>
  );
}
