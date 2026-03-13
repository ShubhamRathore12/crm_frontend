"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  GitBranch,
  BarChart3,
  Megaphone,
  Settings,
  Shield,
  Phone,
  Target,
  Inbox as InboxIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: InboxIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/opportunities", label: "Opportunities", icon: Target },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/interactions", label: "Interactions", icon: MessageSquare },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/sales-marketing", label: "Sales & Marketing", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="font-semibold text-lg">
          CRM
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
