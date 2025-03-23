import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LessonPlans() {
  const mockLessons = [
    {
      id: 1,
      title: "Introduction to Chemical Bonding",
      subject: "Chemistry",
      chapter: "Chemical Bonding",
      duration: 45,
      objectives: "Understanding ionic and covalent bonds",
      createdAt: "2024-03-23",
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      chapter: "Forces and Motion",
      duration: 60,
      objectives: "Learn fundamental laws of motion",
      createdAt: "2024-03-22",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lesson Plans</h1>
          <p className="text-muted-foreground">Create and manage your lesson plans</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teacher/lessons/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Lesson Plan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockLessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{lesson.subject}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{lesson.duration} mins</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-2">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{lesson.chapter}</p>
              <p className="text-sm mt-4">{lesson.objectives}</p>
            </div>
            <div className="p-6 pt-0 mt-auto flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Created: {lesson.createdAt}
              </span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/lessons/${lesson.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teacher/lessons/${lesson.id}/edit`}>
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