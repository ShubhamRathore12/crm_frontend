import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, AlertCircle, Clock, Users, TrendingUp, MessageSquare } from "lucide-react";

const widgets = [
  { title: "Open Leads", value: "—", icon: UserPlus, href: "/leads" },
  { title: "Escalated Leads", value: "—", icon: AlertCircle },
  { title: "Leads within TAT", value: "—", icon: Clock },
  { title: "Agent Performance", value: "—", icon: Users },
  { title: "Lead Conversion", value: "—", icon: TrendingUp },
  { title: "Interaction Status", value: "—", icon: MessageSquare },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of leads, interactions, and performance</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w) => (
          <Card key={w.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {w.title}
              </CardTitle>
              <w.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{w.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agent workspace</CardTitle>
          <p className="text-sm text-muted-foreground">
            Lead list, interaction list, call popup, customer profile, activity timeline
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect backend APIs to populate widgets and lists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
