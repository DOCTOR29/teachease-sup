import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QuizAttempt } from "./quiz-attempt";

export default async function AttemptQuiz({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select(`
      *,
      quiz_blueprints (*),
      quiz_questions (
        question:questions (
          *
        )
      )
    `)
    .eq("id", params.id)
    .single();

  if (!quiz) {
    redirect("/dashboard/student/quizzes");
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">{quiz.title}</h1>
      <QuizAttempt quiz={quiz} />
    </div>
  );
}