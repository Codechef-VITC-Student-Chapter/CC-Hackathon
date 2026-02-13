import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function JudgeRoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      {/* Team details and selected submission for the current round. */}
      <Card>
        <CardHeader>
          <CardTitle>Team details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Team profile, chosen task, and submitted assets.
          </p>
        </CardContent>
      </Card>

      {/* Evaluation inputs for score and remarks. */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Score</label>
            <Input placeholder="Enter score" />
          </div>
          <div>
            <label className="text-sm font-medium">Remarks</label>
            <Textarea placeholder="Add feedback" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
