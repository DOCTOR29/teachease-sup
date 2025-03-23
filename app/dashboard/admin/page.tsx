import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="User Management"
          description="Manage teachers and students"
          href="/dashboard/admin/users"
        />
        <DashboardCard
          title="Content Management"
          description="Manage platform content"
          href="/dashboard/admin/content"
        />
        <DashboardCard
          title="Subscriptions"
          description="Manage teacher subscriptions"
          href="/dashboard/admin/subscriptions"
        />
        <DashboardCard
          title="Platform Settings"
          description="Configure platform settings"
          href="/dashboard/admin/settings"
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