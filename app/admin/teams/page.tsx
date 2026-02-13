import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminTeamsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-12">
      {/* Editable table of all team details, including score and submission status. */}
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Submission status</TableHead>
                <TableHead>Current round</TableHead>
                <TableHead>Track</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Team Alpha</TableCell>
                <TableCell>72</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Round 2</TableCell>
                <TableCell>AI</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team row actions should surface lock, shortlist, and elimination controls. */}
      <Card>
        <CardHeader>
          <CardTitle>Team actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a team row to reveal actions like locking submissions or
            shortlisting.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
