import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify student role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "student") {
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="My Quizzes"
          description="View and attempt assigned quizzes"
          href="/dashboard/student/quizzes"
        />
        <DashboardCard
          title="Practice Tests"
          description="Create and attempt mock quizzes"
          href="/dashboard/student/practice"
        />
        <DashboardCard
          title="Assignments"
          description="View and complete assignments"
          href="/dashboard/student/assignments"
        />
        <DashboardCard
          title="Worksheets"
          description="Access shared worksheets"
          href="/dashboard/student/worksheets"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="p-4 border rounded-lg hover:bg-accent transition-colors"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}