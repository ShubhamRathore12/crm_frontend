/**
 * Backend API base URL. In dev, next.config rewrites /api/* to localhost:8080.
 */
const API_BASE = typeof window !== "undefined" ? "/api" : "http://localhost:8080";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<unknown>("/health"),
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; expires_in: number; user: UserResponse }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; expires_in: number; user: UserResponse }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => request<UserResponse>("/auth/me"),
    otp: (email: string, otp: string) =>
      request<{ token: string; expires_in: number; user: UserResponse }>("/auth/otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }),
    logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
    forgotPassword: (email: string) =>
      request<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    resetPassword: (body: { email: string; otp: string; new_password: string }) =>
      request<{ ok: boolean; message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  leads: {
    list: () => request<unknown[]>("/leads"),
    get: (id: string) => request<unknown>(`/leads/${id}`),
    create: (body: unknown) =>
      request<unknown>("/leads", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<unknown>(`/leads/${id}`, { method: "DELETE" }),
  },
  contacts: {
    list: () => request<unknown[]>("/contacts"),
    get: (id: string) => request<unknown>(`/contacts/${id}`),
    create: (body: unknown) =>
      request<unknown>("/contacts", { method: "POST", body: JSON.stringify(body) }),
    import: (contacts: unknown[]) =>
      request<{ imported: number }>("/contacts/import", {
        method: "POST",
        body: JSON.stringify({ contacts }),
      }),
  },
  interactions: {
    list: () => request<unknown[]>("/interactions"),
    get: (id: string) => request<unknown>(`/interactions/${id}`),
    create: (body: unknown) =>
      request<unknown>("/interactions", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/interactions/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  workflow: {
    list: () => request<unknown[]>("/workflow"),
    get: (id: string) => request<unknown>(`/workflow/${id}`),
    create: (body: unknown) =>
      request<{ id: string }>("/workflow", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/workflow/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    run: (body: { workflow_id: string; entity_id: string; entity_type: string; trigger_data?: Record<string, unknown> }) =>
      request<{ run_id: string; status: string }>("/workflow/run", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  email: {
    sends: (params?: { entity_type?: string; entity_id?: string }) =>
      request<EmailSend[]>(
        "/email/sends",
        params?.entity_type && params?.entity_id
          ? { params: { entity_type: params.entity_type, entity_id: params.entity_id } }
          : undefined
      ),
  },
  integrations: {
    meetingInvite: (body: {
      to_email: string;
      contact_id?: string;
      subject: string;
      body: string;
      calendly_link?: string;
    }) =>
      request<{ ok: boolean; invite_id: string; tracking_id: string; message: string }>(
        "/integrations/meeting-invite",
        { method: "POST", body: JSON.stringify(body) }
      ),
    connections: {
      list: () =>
        request<{ id: string; provider: string; name: string | null; config: Record<string, unknown>; is_active: boolean; created_at: string }[]>(
          "/integrations/connections"
        ),
      create: (body: { provider: string; name?: string; config: Record<string, string> }) =>
        request<{ id: string; provider: string; name: string | null; config: Record<string, unknown> }>(
          "/integrations/connections",
          { method: "POST", body: JSON.stringify(body) }
        ),
    },
    calendlyLink: (contact_email?: string) =>
      request<{ link: string }>("/integrations/calendly/link", {
        method: "POST",
        body: JSON.stringify({ contact_email }),
      }),
    slackNotify: (message: string, channel?: string) =>
      request<{ ok: boolean }>("/integrations/slack/notify", {
        method: "POST",
        body: JSON.stringify({ message, channel }),
      }),
  },
  salesMarketing: {
    tasks: {
      list: (filters?: { status?: string; priority?: string; assignee_id?: string }) =>
        request<SalesTask[]>("/sales-marketing/tasks", filters ? { params: filters as Record<string, string> } : undefined),
      get: (id: string) => request<SalesTask>(`/sales-marketing/tasks/${id}`),
      create: (body: CreateSalesTask) =>
        request<SalesTask>("/sales-marketing/tasks", { method: "POST", body: JSON.stringify(body) }),
      update: (id: string, body: Partial<CreateSalesTask>) =>
        request<SalesTask>(`/sales-marketing/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
      delete: (id: string) =>
        request<{ ok: boolean }>(`/sales-marketing/tasks/${id}`, { method: "DELETE" }),
    },
    forms: {
      list: () => request<SalesForm[]>("/sales-marketing/forms"),
      get: (id: string) => request<SalesForm>(`/sales-marketing/forms/${id}`),
      create: (body: { name: string; description?: string; fields_json?: unknown }) =>
        request<SalesForm>("/sales-marketing/forms", { method: "POST", body: JSON.stringify(body) }),
      update: (id: string, body: { name?: string; description?: string; fields_json?: unknown; is_active?: boolean }) =>
        request<{ ok: boolean }>(`/sales-marketing/forms/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
      delete: (id: string) =>
        request<{ ok: boolean }>(`/sales-marketing/forms/${id}`, { method: "DELETE" }),
      submit: (id: string, data: unknown) =>
        request<SalesFormSubmission>(`/sales-marketing/forms/${id}/submit`, { method: "POST", body: JSON.stringify({ data_json: data }) }),
      submissions: (id: string) =>
        request<SalesFormSubmission[]>(`/sales-marketing/forms/${id}/submissions`),
    },
  },
  opportunities: {
    list: () => request<Opportunity[]>("/opportunities"),
    get: (id: string) => request<Opportunity>(`/opportunities/${id}`),
    create: (body: CreateOpportunity) =>
      request<Opportunity>("/opportunities", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CreateOpportunity>) =>
      request<Opportunity>(`/opportunities/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  attachments: {
    list: (params?: { entity_type: string; entity_id: string }) =>
      request<Attachment[]>("/attachments", params ? { params } : undefined),
    delete: (id: string) => request<{ ok: boolean }>(`/attachments/${id}`, { method: "DELETE" }),
  },
  bulkUploads: {
    list: () => request<BulkUpload[]>("/bulk-uploads"),
    get: (id: string) => request<BulkUpload>(`/bulk-uploads/${id}`),
    create: (body: { file_name: string; entity_type: string }) =>
      request<BulkUpload>("/bulk-uploads", { method: "POST", body: JSON.stringify(body) }),
  },
  fields: {
    list: () => request<FieldDefinition[]>("/fields"),
    create: (body: CreateField) =>
      request<FieldDefinition>("/fields", { method: "POST", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/fields/${id}`, { method: "DELETE" }),
  },
  maintenance: {
    runArchive: () => request<any>("/maintenance/archive/run", { method: "POST" }),
  },
  teams: {
    list: () => request<Team[]>("/teams"),
    create: (body: { name: string; manager_id?: string }) =>
      request<Team>("/teams", { method: "POST", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/teams/${id}`, { method: "DELETE" }),
    members: {
      list: (id: string) => request<any[]>(`/teams/${id}/members`),
      add: (id: string, userId: string) =>
        request<any>(`/teams/${id}/members`, { method: "POST", body: JSON.stringify({ user_id: userId }) }),
      remove: (id: string, userId: string) =>
        request<any>(`/teams/${id}/members/${userId}`, { method: "DELETE" }),
    },
  },
  analytics: {
    leads: () => request<LeadStats>("/analytics/leads"),
    interactions: () => request<InteractionStats>("/analytics/interactions"),
    opportunities: () => request<OpportunityStats>("/analytics/opportunities"),
    overall: () => request<OverallStats>("/analytics/overall"),
  },
  emails: {
    list: () => request<InboundEmail[]>("/email-inbound/list"),
    detail: (id: string) => request<InboundEmailDetail>(`/email-inbound/${id}`),
  },
  users: {
    list: () => request<any[]>("/users"),
    create: (body: { name: string; email: string; role: string }) =>
      request<any>("/users", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: any) =>
      request<any>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<{ ok: boolean }>(`/users/${id}`, { method: "DELETE" }),
  },
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  team_id: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Opportunity = {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  value: string | null;
  currency: string | null;
  stage: "discovery" | "proposal" | "negotiation" | "won" | "lost";
  probability: number | null;
  expected_closed_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateOpportunity = {
  lead_id: string;
  title: string;
  description?: string;
  value?: number;
  currency?: string;
  stage?: string;
  probability?: number;
  expected_closed_at?: string;
  assigned_to?: string;
};

export type Attachment = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  entity_type: "lead" | "contact" | "interaction" | "opportunity" | "task";
  entity_id: string;
  uploaded_by: string | null;
  created_at: string;
};

export type BulkUpload = {
  id: string;
  file_name: string;
  entity_type: "contact" | "lead";
  status: "pending" | "processing" | "completed" | "failed";
  total_rows: number | null;
  processed_rows: number | null;
  failed_rows: number | null;
  error_log: string | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
};

export type FieldDefinition = {
  id: string;
  entity_type: string;
  field_name: string;
  label: string;
  field_type: "text" | "number" | "select" | "boolean" | "date";
  options: any | null;
  is_required: boolean;
  is_system: boolean;
  display_order: number;
};

export type CreateField = {
  entity_type: string;
  field_name: string;
  label: string;
  field_type: string;
  options?: any;
  is_required?: boolean;
  display_order?: number;
};

export type Team = {
  id: string;
  name: string;
  manager_id: string | null;
  created_at: string;
};

export type LeadStats = {
  total: number;
  by_status: { label: string; count: number }[];
  by_source: { label: string; count: number }[];
  growth: { label: string; value: number }[];
};

export type InteractionStats = {
  total: number;
  by_channel: { label: string; count: number }[];
  by_priority: { label: string; count: number }[];
};

export type OpportunityStats = {
  total: number;
  total_value: number;
  by_stage: { label: string; count: number; value: number }[];
};

export type OverallStats = {
  leads: number;
  interactions: number;
  opportunities: number;
  tasks: number;
};

export type InboundEmail = {
  id: string;
  contact_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  subject: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  latest_message: string | null;
  created_at: string;
};

export type InboundEmailDetail = {
  id: string;
  contact_id: string | null;
  subject: string;
  status: string;
  messages: {
    id: string;
    sender: string;
    content: string;
    created_at: string;
  }[];
};

export type EmailSend = {
  id: string;
  tracking_id: string;
  to_email: string;
  subject: string;
  entity_type: string | null;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type SalesTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "ready_for_launch" | "launched" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  assignee_id: string | null;
  tags: string[];
  start_date: string | null;
  end_date: string | null;
  estimated_hours: number;
  effort_hours: number;
  category: string;
  department: string;
  parent_task_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateSalesTask = {
  title: string;
  description?: string;
  status?: SalesTask["status"];
  priority?: SalesTask["priority"];
  assignee_id?: string;
  tags?: string[];
  start_date?: string;
  end_date?: string;
  estimated_hours?: number;
  effort_hours?: number;
  category?: string;
  department?: string;
  parent_task_id?: string;
};

export type SalesForm = {
  id: string;
  name: string;
  description: string;
  fields_json: unknown;
  is_active: boolean;
  open_count: number;
  closed_count: number;
  created_at: string;
  updated_at: string;
};

export type SalesFormSubmission = {
  id: string;
  form_id: string;
  data_json: unknown;
  status: "open" | "closed";
  submitted_at: string;
};
