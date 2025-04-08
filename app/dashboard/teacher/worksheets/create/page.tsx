import { WorksheetForm } from "./worksheet-form";


export default function CreateWorksheetPaper() {
  const mockSubjects = [
    { id: "1", name: "Physics" },
    { id: "2", name: "Chemistry" },
    { id: "3", name: "Biology" },
    { id: "4", name: "Mathematics" },
  ];

  const mockChapters = [
    { id: "1", name: "Forces and Motion", subject_id: "1" },
    { id: "2", name: "Chemical Bonding", subject_id: "2" },
    { id: "3", name: "Cell Biology", subject_id: "3" },
    { id: "4", name: "Trigonometry", subject_id: "4" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Worsheet Paper</h1>
        <p className="text-muted-foreground">Design a comprehensive worksheet </p>
      </div>
      <WorksheetForm subjects={mockSubjects} chapters={mockChapters} />
    </div>
  );
}