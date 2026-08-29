import { getTeam } from "@/lib/queries";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { PageHead } from "@/components/page-kit";
import { MoreHorizontal, Plus } from "lucide-react";
export default async function Team() {
  const members = await getTeam();
  return (
    <>
      <PageHead
        title="Team"
        description="Manage workspace members, roles and access."
        action={
          <Button>
            <Plus className="size-4" />
            Invite member
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {["Member", "Role", "Status", "Last active", ""].map((x) => (
                  <th key={x} className="px-5 py-3 font-medium">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.name + m.role} className="border-t">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.initials} />
                      <div>
                        <b className="block">{m.name}</b>
                        <span className="text-xs text-muted-foreground">
                          Joined {m.joined}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5">
                    <Badge tone="blue">{m.role}</Badge>
                  </td>
                  <td className="px-5">
                    <Badge tone="green">Active</Badge>
                  </td>
                  <td className="px-5 text-muted-foreground">
                    Secured by Supabase
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      aria-label={`Actions for ${m.name}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
