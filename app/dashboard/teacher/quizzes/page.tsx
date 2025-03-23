import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Clock, GraduationCap, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Quizzes() {
  const mockQuizzes = [
    {
      id: 1,
      title: "Chemical Reactions Quiz",
      subject: "Chemistry",
      class: "Grade 11",
      questionCount: 20,
      duration: 30,
      difficulty: "medium",
      isMcqOnly: true,
      createdAt: "2024-03-23",
    },
    {
      id: 2,
      title: "Forces and Motion Test",
      subject: "Physics",
      class: "Grade 12",
      questionCount: 15,
      duration: 45,
      difficulty: "hard",
      isMcqOnly: false,
      createdAt: "2024-03-22",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage student quizzes</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teacher/quizzes/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockQuizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{quiz.subject}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{quiz.duration} mins</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-2">{quiz.title}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">Class: {quiz.class}</p>
                <p className="text-sm text-muted-foreground">Questions: {quiz.questionCount}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground capitalize">
                    Difficulty: {quiz.difficulty}
                  </p>
                  {quiz.isMcqOnly && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      MCQ Only
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 mt-auto flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Created: {quiz.createdAt}
              </span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/quizzes/${quiz.id}`}>
                    View Results
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/quizzes/${quiz.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}