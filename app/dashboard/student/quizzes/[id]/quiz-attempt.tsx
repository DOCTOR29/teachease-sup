"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  content: string;
  type: "mcq" | "descriptive";
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  quiz_questions: {
    question: Question;
  }[];
  quiz_blueprints: {
    allow_file_upload: boolean;
  };
}

export function QuizAttempt({ quiz }: { quiz: Quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const question = quiz.quiz_questions[currentQuestion]?.question;

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: answer,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      let fileUrl = null;
      if (file) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from("quiz-submissions")
          .upload(`${quiz.id}/${file.name}`, file);

        if (fileError) throw fileError;
        fileUrl = fileData.path;
      }

      const { error } = await supabase.from("quiz_attempts").insert({
        quiz_id: quiz.id,
        answers,
        uploaded_file_url: fileUrl,
      });

      if (error) throw error;

      toast.success("Quiz submitted successfully");
      router.push("/dashboard/student/quizzes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!question) return null;

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.quiz_questions.length}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-lg">{question.content}</p>

          {question.type === "mcq" ? (
            <RadioGroup
              value={answers[question.id]}
              onValueChange={handleAnswer}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion < quiz.quiz_questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            disabled={!answers[question.id]}
          >
            Next
          </Button>
        ) : (
          <div className="space-y-4">
            {quiz.quiz_blueprints.allow_file_upload && (
              <div>
                <Label htmlFor="file">Upload Additional File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}