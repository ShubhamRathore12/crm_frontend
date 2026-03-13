import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-muted-foreground">Users, teams, RBAC, audit logs</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User & role management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">RBAC roles, JWT, MFA, rate limiting.</p>
        </CardContent>
      </Card>
    </div>
  );
}
