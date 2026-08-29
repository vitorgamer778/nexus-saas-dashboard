export type InsightKind =
  | "churn-risk"
  | "conversion-anomaly"
  | "mrr-opportunity"
  | "failed-payment-trend"
  | "retention-improvement";

export type NexusInsight = {
  id: string;
  kind: InsightKind;
  eyebrow: string;
  title: string;
  summary: string;
  possibleCause: string;
  confidence: number;
  impact: string;
  evidence: string[];
};

export type IntelligenceContext = {
  activeCustomers: number;
  mrr: number;
  churn: number;
};

export interface IntelligenceProvider {
  readonly mode: "demo" | "live";
  getInsights(context: IntelligenceContext): Promise<NexusInsight[]>;
}

const demoInsights: NexusInsight[] = [
  {
    id: "conversion-invite-window",
    kind: "conversion-anomaly",
    eyebrow: "Conversion anomaly",
    title: "Trial conversion dropped 14%",
    summary:
      "The largest change is concentrated in single-user trial accounts.",
    possibleCause:
      "Users who do not invite another team member within 24 hours convert 37% less.",
    confidence: 94,
    impact: "Potential +8.2% trial-to-paid recovery",
    evidence: [
      "Conversion decline began 9 days ago",
      "Single-user trials represent 61% of the affected cohort",
      "Multi-user trials remain inside the normal range",
    ],
  },
  {
    id: "churn-low-engagement",
    kind: "churn-risk",
    eyebrow: "Churn risk",
    title: "18 accounts show early churn signals",
    summary: "Product activity weakened across a high-value customer segment.",
    possibleCause:
      "Accounts with no dashboard visit for 7 days are 2.4× more likely to cancel next month.",
    confidence: 89,
    impact: "$6,480 MRR currently at risk",
    evidence: [
      "Usage fell in three consecutive sessions",
      "Seven accounts have an upcoming renewal",
      "Support engagement is below the retained cohort baseline",
    ],
  },
  {
    id: "mrr-team-expansion",
    kind: "mrr-opportunity",
    eyebrow: "MRR opportunity",
    title: "Team expansion can unlock $9.2k MRR",
    summary:
      "Several active accounts are approaching their current seat limits.",
    possibleCause:
      "Customers above 80% seat utilization accept expansion offers 31% more often.",
    confidence: 91,
    impact: "Estimated $9,240 expansion MRR",
    evidence: [
      "24 accounts are above the utilization threshold",
      "Median expansion window is 12 days",
      "Business-plan accounts show the strongest intent",
    ],
  },
  {
    id: "failed-payments-card-expiry",
    kind: "failed-payment-trend",
    eyebrow: "Payment trend",
    title: "Failed payments increased 22%",
    summary:
      "The increase is isolated to renewal charges rather than new purchases.",
    possibleCause:
      "Expired cards account for most new failures, suggesting a recovery workflow opportunity.",
    confidence: 87,
    impact: "$3,760 recoverable revenue",
    evidence: [
      "64% of failures share an expired-card decline code",
      "Second-attempt recovery remains below baseline",
      "Failures peak two days after the billing cycle starts",
    ],
  },
  {
    id: "retention-activation-path",
    kind: "retention-improvement",
    eyebrow: "Retention improvement",
    title: "One workflow correlates with 19% better retention",
    summary: "Long-term customers complete the same activation sequence early.",
    possibleCause:
      "Creating a customer, subscription and first report in week one builds a stronger habit loop.",
    confidence: 92,
    impact: "Potential -1.8 pts monthly churn",
    evidence: [
      "Pattern appears across three customer cohorts",
      "The effect persists after controlling for plan tier",
      "Completion within 72 hours has the strongest result",
    ],
  },
];

class DemoIntelligenceProvider implements IntelligenceProvider {
  readonly mode = "demo" as const;
  async getInsights(context: IntelligenceContext) {
    void context;
    return demoInsights;
  }
}

const provider: IntelligenceProvider = new DemoIntelligenceProvider();

export async function getNexusInsights(context: IntelligenceContext) {
  return { mode: provider.mode, insights: await provider.getInsights(context) };
}
