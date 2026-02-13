import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamRoundsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      {/* Display all rounds available to the team. */}
      <Card>
        <CardHeader>
          <CardTitle>All rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3">Round 1</div>
            <div className="rounded-md border p-3">Round 2</div>
            <div className="rounded-md border p-3">Round 3</div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
