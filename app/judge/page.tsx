import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JudgeHomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      {/* Judges see assigned teams with evaluation status. */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3">Team Alpha - Pending</div>
            <div className="rounded-md border p-3">Team Beta - Scored</div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
