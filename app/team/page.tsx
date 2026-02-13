import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamDashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      {/* Team name, track, and current round summary. */}
      <Card>
        <CardHeader>
          <CardTitle>Team snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Team name, track, and current round name at a glance.
          </p>
        </CardContent>
      </Card>

      {/* Countdown timer and status for the active round. */}
      <Card>
        <CardHeader>
          <CardTitle>Round countdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Time remaining and current round status.
          </p>
        </CardContent>
      </Card>

      {/* Instructions for the current round. */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Guidance and rules specific to the active round.
          </p>
        </CardContent>
      </Card>

      {/* Navigation to the full rounds list. */}
      <div>
        <Button>Go to rounds</Button>
      </div>
    </main>
  );
}
