"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { BulkUploadModal } from "@/components/leads/bulk-upload-modal";

export default function LeadsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage incoming leads, scores, and conversions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button asChild>
            <Link href="/leads/new">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Link>
          </Button>
        </div>
      </div>

      <BulkUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        entityType="lead"
      />
      <Card>
        <CardHeader>
          <CardTitle>Lead list</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sources: Website, Phone, Email, Walk-in, Core system APIs. Mandatory mobile number.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use GET /leads and TanStack Table for sortable, filterable list. Connect to backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
