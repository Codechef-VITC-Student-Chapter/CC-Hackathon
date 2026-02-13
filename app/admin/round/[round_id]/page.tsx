import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminRoundDetailPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-12">
      {/* Manage subtasks for the selected round and create new ones. */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Round subtasks</CardTitle>
          <Button>Create subtask</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3">Subtask A</div>
            <div className="rounded-md border p-3">Subtask B</div>
          </div>
        </CardContent>
      </Card>

      {/* Start or stop the round with one-click controls. */}
      <Card>
        <CardHeader>
          <CardTitle>Round status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Start round</Button>
          <Button variant="secondary">Stop round</Button>
        </CardContent>
      </Card>

      {/* Track selected teams and assign their next-round task choices. */}
      <Card>
        <CardHeader>
          <CardTitle>Selected teams</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Previous option</TableHead>
                <TableHead>Chosen option</TableHead>
                <TableHead>Next task A</TableHead>
                <TableHead>Next task B</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Team Alpha</TableCell>
                <TableCell>Option 1</TableCell>
                <TableCell>Option 2</TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task-1">Task 1</SelectItem>
                      <SelectItem value="task-2">Task 2</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task-3">Task 3</SelectItem>
                      <SelectItem value="task-4">Task 4</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
