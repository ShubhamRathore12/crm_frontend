import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function InteractionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Interactions</h1>
          <p className="text-muted-foreground">
            New → Agent Assigned → In Progress → Resolved → Closed. Reopen by email with interaction ID in subject.
          </p>
        </div>
        <Button asChild>
          <Link href="/interactions/new">
            <Plus className="h-4 w-4 mr-2" />
            New Interaction
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Interaction list</CardTitle>
          <p className="text-sm text-muted-foreground">Email tickets, SMS, call support, escalations, SLA, CSAT</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect GET /interactions and lifecycle filters.</p>
        </CardContent>
      </Card>
    </div>
  );
}
