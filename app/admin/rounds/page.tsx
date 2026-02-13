import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRoundsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      {/* List all rounds in a simple row layout with quick access. */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rounds</CardTitle>
          <Button>Create round</Button>
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
