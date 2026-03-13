"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Contact = {
  id: string;
  ucc_code: string;
  name: string;
  mobile: string;
  email?: string | null;
};

export default function NewLeadPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactId, setContactId] = useState("");
  const [source, setSource] = useState("website");
  const [product, setProduct] = useState("");
  const [campaign, setCampaign] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.contacts
      .list()
      .then((rows) => setContacts(rows as Contact[]))
      .catch(() => setContacts([]));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      if (!contactId) throw new Error("Select a contact");
      await api.leads.create({
        contact_id: contactId,
        source,
        product: product.trim() ? product.trim() : null,
        campaign: campaign.trim() ? campaign.trim() : null,
      });
      setStatus("Lead created.");
      setProduct("");
      setCampaign("");
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Lead</h1>
        <p className="text-muted-foreground">Create a lead (mobile is mandatory at Contact level).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact *</label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select contact</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.mobile})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="website">Website</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign</label>
              <input
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          {status && <p className="text-sm text-muted-foreground">{status}</p>}
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Create lead"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

