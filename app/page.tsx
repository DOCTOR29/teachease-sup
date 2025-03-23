import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import { GraduationCap, School, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col items-center gap-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <DashboardCard
            title="Teacher Dashboard"
            description="Create and manage lessons, quizzes, and assignments"
            icon={<School className="w-8 h-8" />}
            href="/sign-up?role=teacher"
          />
          <DashboardCard
            title="Student Dashboard"
            description="Access learning materials and take quizzes"
            icon={<GraduationCap className="w-8 h-8" />}
            href="/sign-up?role=student"
          />
          <DashboardCard
            title="Admin Dashboard"
            description="Manage users and platform content"
            icon={<ShieldCheck className="w-8 h-8" />}
            href="/sign-up?role=admin"
          />
        </div>
      </main>
    </>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 border rounded-lg space-y-4">
      <div className="text-primary">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button asChild className="w-full">
        <Link href={href}>Get Started</Link>
      </Button>
    </div>
  );
}
