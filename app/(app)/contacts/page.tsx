import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="text-muted-foreground">UCC as unique identifier</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/contacts/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Link>
          </Button>
          <Button asChild>
            <Link href="/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              New Contact
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact list</CardTitle>
          <p className="text-sm text-muted-foreground">POST /contacts/import for batch import</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect GET /contacts and table view.</p>
        </CardContent>
      </Card>
    </div>
  );
}
