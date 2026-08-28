import { PageHead, Metric } from "@/components/page-kit";
import { Button } from "@/components/ui";
import { CustomersTable } from "@/components/customers-table";
import { Plus } from "lucide-react";
export default function Customers() {
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
        <Metric label="Total customers" value="1,284" change="6.8%" />
        <Metric label="New this month" value="128" change="14.2%" />
        <Metric label="Average revenue" value="$372" change="4.1%" />
      </div>
      <CustomersTable />
    </>
  );
}
