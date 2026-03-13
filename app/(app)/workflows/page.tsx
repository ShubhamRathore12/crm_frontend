import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, GitBranch } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-muted-foreground">
            Visual flow builder: Trigger → Assign → Send SMS → Delay → Escalate
          </p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Flow builder (React Flow)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Nodes: Trigger, Condition, Delay, Send Notification, Assign Agent, Update Status, API Call
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Triggers: lead.created, interaction.created, call.received, sla.timeout. Save definition_json via POST /workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
