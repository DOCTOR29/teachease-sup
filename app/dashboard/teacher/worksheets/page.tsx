import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Worksheets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Worksheets</h1>
        <Button asChild>
          <Link href="/dashboard/teacher/worksheets/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Worksheet
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Worksheet cards will be mapped here */}
      </div>
    </div>
  );
}