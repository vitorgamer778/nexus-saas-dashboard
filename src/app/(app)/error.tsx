"use client";
import { Button, Card } from "@/components/ui";
import { CircleAlert } from "lucide-react";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <Card className="mx-auto mt-20 max-w-lg p-8 text-center">
      <CircleAlert className="mx-auto size-9 text-red-500" />
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn’t load this view. Your data is safe—please try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </Card>
  );
}
