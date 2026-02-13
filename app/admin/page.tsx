import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminHomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      {/* Summary snapshot of all teams. */}
      <Card>
        <CardHeader>
          <CardTitle>Teams overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Quick glance at total teams, active submissions, and aggregate
            scores.
          </p>
        </CardContent>
      </Card>

      {/* Current round metrics: submissions and pending reviews. */}
      <Card>
        <CardHeader>
          <CardTitle>Current round status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Live submission count and pending evaluation queue for this round.
          </p>
        </CardContent>
      </Card>

      {/* Round control panel with selection and state actions. */}
      <Card>
        <CardHeader>
          <CardTitle>Round controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select>
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Select a round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="round-1">Round 1</SelectItem>
              <SelectItem value="round-2">Round 2</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button>Start round</Button>
            <Button variant="secondary">Stop round</Button>
            <Button variant="outline">Toggle submissions</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
