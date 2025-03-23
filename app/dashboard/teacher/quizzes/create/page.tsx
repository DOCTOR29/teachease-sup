import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QuizForm } from "./quiz-form";

export default async function CreateQuiz() {
  const supabase = await createClient();
  
  // Get subjects and chapters for the form
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name");

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, name, subject_id");

  if (!subjects || !chapters) {
    return <div>Error loading form data</div>;
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Create New Quiz</h1>
      <QuizForm subjects={subjects} chapters={chapters} />
    </div>
  );
}