import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamRoundDetailPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      {/* Two subtask cards appear first with a select action on each. */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subtask A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Description of the first available subtask.
            </p>
            <Button>Select this task</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subtask B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Description of the second available subtask.
            </p>
            <Button>Select this task</Button>
          </CardContent>
        </Card>
      </div>

      {/* Submission section stays hidden until a task is selected. */}
      <Card>
        <CardHeader>
          <CardTitle>Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            After selecting a task, teams can upload a PDF for Round 1.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
