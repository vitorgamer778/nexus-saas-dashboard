"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { CustomerView } from "@/lib/queries";
import { Avatar, Badge, Button, Card, Input } from "./ui";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
export function CustomersTable({ customers }: { customers: CustomerView[] }) {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      customers.filter((c) =>
        (c.name + c.company + c.email).toLowerCase().includes(q.toLowerCase()),
      ),
    [customers, q],
  );
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customers…"
            className="pl-9"
            aria-label="Search customers"
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="size-4" />
          All filters
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="w-10 px-5 py-3">
                <input type="checkbox" aria-label="Select all customers" />
              </th>
              <th className="py-3 font-medium">Customer</th>
              <th className="px-4 font-medium">Plan</th>
              <th className="px-4 font-medium">Status</th>
              <th className="px-4 font-medium">MRR</th>
              <th className="px-4 font-medium">Joined</th>
              <th className="px-4 font-medium">Last activity</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/40">
                <td className="px-5">
                  <input type="checkbox" aria-label={`Select ${c.name}`} />
                </td>
                <td className="py-3">
                  <Link
                    href={`/customers/${c.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar initials={c.initials} />
                    <span>
                      <b className="block font-medium hover:text-primary">
                        {c.name}
                      </b>
                      <span className="text-xs text-muted-foreground">
                        {c.company} · {c.email}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4">{c.plan}</td>
                <td className="px-4">
                  <Badge
                    tone={
                      c.status === "Active"
                        ? "green"
                        : c.status === "Trial"
                          ? "blue"
                          : "amber"
                    }
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="px-4 font-mono">${c.mrr.toLocaleString()}</td>
                <td className="px-4 text-muted-foreground">{c.joined}</td>
                <td className="px-4 text-muted-foreground">{c.activity}</td>
                <td className="px-4">
                  <Button variant="ghost" aria-label={`Actions for ${c.name}`}>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-medium">No customers found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different name, company or email.
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 text-sm text-muted-foreground">
        <span>
          Showing {rows.length} of {customers.length} customers
        </span>
        <div className="flex gap-1">
          <Button variant="outline" aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" aria-label="Next page">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
