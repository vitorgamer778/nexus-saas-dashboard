import { Onboarding } from "@/components/onboarding";
import { getPlans } from "@/lib/queries";

export default async function Page() {
  const plans = await getPlans();
  return (
    <Onboarding
      plans={plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        priceMonthly: Number(plan.price_monthly),
      }))}
    />
  );
}
