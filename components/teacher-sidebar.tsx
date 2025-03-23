'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileQuestion,
  FileText,
  GraduationCap,
  Home,
  ScrollText,
  BarChart,
  Settings,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const items = [
    {
      title: "Overview",
      href: "/dashboard/teacher",
      icon: Home,
    },
    {
      title: "Lesson Plans",
      href: "/dashboard/teacher/lessons",
      icon: BookOpen,
    },
    {
      title: "Question Papers",
      href: "/dashboard/teacher/questions",
      icon: FileQuestion,
    },
    {
      title: "Worksheets",
      href: "/dashboard/teacher/worksheets",
      icon: FileText,
    },
    {
      title: "Quizzes",
      href: "/dashboard/teacher/quizzes",
      icon: GraduationCap,
    },
    {
      title: "Assignments",
      href: "/dashboard/teacher/assignments",
      icon: ScrollText,
    },
    {
      title: "Analytics",
      href: "/dashboard/teacher/analytics",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/dashboard/teacher/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className={cn("space-y-2", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              pathname === item.href ? "bg-accent" : "transparent"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}