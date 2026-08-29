import { getCustomerDetails } from "@/lib/queries";
import { z } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = z
    .string()
    .uuid()
    .safeParse((await params).id);
  if (!parsed.success)
    return Response.json({ error: "Invalid customer" }, { status: 400 });
  const details = await getCustomerDetails(parsed.data);
  if (!details)
    return Response.json({ error: "Customer not found" }, { status: 404 });
  return Response.json(details, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
