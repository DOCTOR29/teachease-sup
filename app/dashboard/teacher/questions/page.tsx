import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Clock, FileQuestion, BookOpen } from "lucide-react";
import Link from "next/link";

export default function QuestionPapers() {
  const mockPapers = [
    {
      id: 1,
      title: "Mid-Term Physics Exam",
      subject: "Physics",
      class: "Grade 11",
      totalMarks: 100,
      duration: 180,
      difficulty: "medium",
      createdAt: "2024-03-23",
    },
    {
      id: 2,
      title: "Chemistry Unit Test",
      subject: "Chemistry",
      class: "Grade 12",
      totalMarks: 50,
      duration: 90,
      difficulty: "hard",
      createdAt: "2024-03-22",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Question Papers</h1>
          <p className="text-muted-foreground">Create and manage question papers</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teacher/questions/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Question Paper
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockPapers.map((paper) => (
          <Card key={paper.id} className="flex flex-col">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{paper.subject}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{paper.duration} mins</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-2">{paper.title}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">Class: {paper.class}</p>
                <p className="text-sm text-muted-foreground">Total Marks: {paper.totalMarks}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  Difficulty: {paper.difficulty}
                </p>
              </div>
            </div>
            <div className="p-6 pt-0 mt-auto flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Created: {paper.createdAt}
              </span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/questions/${paper.id}`}>
                    Preview
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/questions/${paper.id}/edit`}>
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