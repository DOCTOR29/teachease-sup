import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  
  

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="Lesson Plans"
          description="Create and manage your lesson plans"
          href="/dashboard/teacher/lessons"
        />
        <DashboardCard
          title="Question Papers"
          description="Generate and manage question papers"
          href="/dashboard/teacher/questions"
        />
        <DashboardCard
          title="Worksheets"
          description="Create printable or digital worksheets"
          href="/dashboard/teacher/worksheets"
        />
        <DashboardCard
          title="Quizzes"
          description="Create and manage quizzes"
          href="/dashboard/teacher/quizzes"
        />
        <DashboardCard
          title="Assignments"
          description="Manage student assignments"
          href="/dashboard/teacher/assignments"
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