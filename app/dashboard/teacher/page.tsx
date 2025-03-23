import { Card } from "@/components/ui/card";
import {
  BookOpen,
  FileQuestion,
  FileText,
  GraduationCap,
  ScrollText,
  Users,
} from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Teacher!</h1>
        <p className="text-muted-foreground">Here's an overview of your teaching activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Students"
          value="156"
          description="Active students"
          icon={Users}
        />
        <StatsCard
          title="Lessons Created"
          value="24"
          description="This month"
          icon={BookOpen}
        />
        <StatsCard
          title="Pending Reviews"
          value="12"
          description="Assignments & quizzes"
          icon={ScrollText}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickActionButton
              href="/dashboard/teacher/lessons/create"
              icon={BookOpen}
              label="Create Lesson"
            />
            <QuickActionButton
              href="/dashboard/teacher/questions/create"
              icon={FileQuestion}
              label="New Question Paper"
            />
            <QuickActionButton
              href="/dashboard/teacher/quizzes/create"
              icon={GraduationCap}
              label="Create Quiz"
            />
            <QuickActionButton
              href="/dashboard/teacher/worksheets/create"
              icon={FileText}
              label="New Worksheet"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Physics Quiz"
              description="5 students completed"
              time="2 hours ago"
            />
            <ActivityItem
              title="Chemistry Worksheet"
              description="New submissions"
              time="4 hours ago"
            />
            <ActivityItem
              title="Biology Assignment"
              description="Grading pending"
              time="Yesterday"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}