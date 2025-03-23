import { QuestionPaperForm } from "./question-paper-form";

export default function CreateQuestionPaper() {
  const mockSubjects = [
    { id: "1", name: "Physics" },
    { id: "2", name: "Chemistry" },
    { id: "3", name: "Biology" },
  ];

  const mockChapters = [
    { id: "1", name: "Forces and Motion", subject_id: "1" },
    { id: "2", name: "Chemical Bonding", subject_id: "2" },
    { id: "3", name: "Cell Biology", subject_id: "3" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Question Paper</h1>
        <p className="text-muted-foreground">Design a comprehensive question paper</p>
      </div>
      <QuestionPaperForm subjects={mockSubjects} chapters={mockChapters} />
    </div>
  );
}