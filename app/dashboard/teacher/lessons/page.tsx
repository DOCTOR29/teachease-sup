import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function LessonPlans() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify teacher role and subscription
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") {
    return redirect("/");
  }

  // Fetch lesson plans
  const { data: lessons } = await supabase
    .from("lessons")
    .select(`
      *,
      subjects (name),
      chapters (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Lesson Plans</h1>
        <Button asChild>
          <Link href="/dashboard/teacher/lessons/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Lesson Plan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons?.map((lesson) => (
          <div
            key={lesson.id}
            className="border rounded-lg p-4 hover:bg-accent transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
            <div className="text-sm text-muted-foreground">
              <p>Subject: {lesson.subjects.name}</p>
              <p>Chapter: {lesson.chapters.name}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/teacher/lessons/${lesson.id}`}>
                  View Details
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/teacher/lessons/${lesson.id}/edit`}>
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}