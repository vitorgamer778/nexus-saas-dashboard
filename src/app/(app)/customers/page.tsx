import { PageHead, Metric } from "@/components/page-kit";
import { Button } from "@/components/ui";
import { CustomersTable } from "@/components/customers-table";
import { Plus } from "lucide-react";
import { getCustomers } from "@/lib/queries";

export default async function Customers() {
  const customers = await getCustomers();
  const monthlyRevenue = customers.reduce(
    (total, customer) => total + customer.mrr,
    0,
  );
  return (
    <>
      <PageHead
        title="Customers"
        description="Manage customer relationships, plans and health."
        action={
          <Button>
            <Plus className="size-4" />
            Add customer
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Total customers"
          value={String(customers.length)}
          change="Live"
        />
        <Metric
          label="Monthly revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="Live"
        />
        <Metric
          label="Average revenue"
          value={
            customers.length
              ? `$${Math.round(monthlyRevenue / customers.length).toLocaleString()}`
              : "$0"
          }
          change="Live"
        />
      </div>
      <CustomersTable customers={customers} />
    </>
  );
}
