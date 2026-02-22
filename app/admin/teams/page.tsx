"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Users, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { setBreadcrumbs } from "@/lib/hooks/useBreadcrumb";
import {
  useGetAdminTeamsQuery,
  useCreateTeamMutation,
} from "@/lib/redux/api/adminApi";
import { useGetTracksQuery } from "@/lib/redux/api/adminApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Define team type based on API response
type Team = {
  id: string;
  team_name: string;
  track: string;
  current_round_id: string | null;
  current_round_name: string | null;
  score: number | null;
  submission_status: string; // 'submitted' | 'pending' | 'locked'
  is_locked: boolean;
  is_shortlisted: boolean;
  is_eliminated: boolean;
};

export default function AdminTeamsPage() {
  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([{ label: "Teams", href: "/admin/teams" }]);
  }, []);

  // RTK Query Hooks
  const { data: teams = [], isLoading } = useGetAdminTeamsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30s
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [createTeam] = useCreateTeamMutation();

  // Extract all unique rounds from teams' round_scores
  const allRounds = Array.from(
    new Map(
      teams
        .flatMap((t: any) => t.round_scores || [])
        .map((r: any) => [
          r.round_id,
          { round_id: r.round_id, round_number: r.round_number },
        ]),
    ).values(),
  ).sort((a: any, b: any) => a.round_number - b.round_number);

  // Create Team Logic
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmail, setNewTeamEmail] = useState("");
  const [newTeamTrack, setNewTeamTrack] = useState("");
  const { data: tracks = [] } = useGetTracksQuery();

  const handleCreateTeam = async () => {
    try {
      // Determine track_id: if user selected an id use it, otherwise try to match by name
      let track_id = newTeamTrack;
      if (!track_id && tracks.length > 0) {
        // try to match by name
        const matched = tracks.find((t: any) => t.name === newTeamTrack || t.id === newTeamTrack);
        if (matched) track_id = matched.id || matched._id;
      }

      await createTeam({
        team_name: newTeamName,
        email: newTeamEmail,
        track_id,
      }).unwrap();

      toast.success("Team created successfully");
      setCreateOpen(false);
      setNewTeamName("");
      setNewTeamEmail("");
      setNewTeamTrack("");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Error creating team");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Teams
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage team details across all rounds.
        </p>
      </header>

      <Card
        className={cn(
          "overflow-hidden border-white/10 bg-card/80 shadow-lg backdrop-blur-sm",
          "dark:border-white/10 dark:bg-card/80",
        )}
      >
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="size-5 text-muted-foreground" />
            All teams
          </CardTitle>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl">
                <Plus className="size-4" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Enter the team name and track.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. CodeWizards"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Leader Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTeamEmail}
                    onChange={(e) => setNewTeamEmail(e.target.value)}
                    placeholder="leader@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="track">Track</Label>
                    {tracks.length > 0 ? (
                      <Select value={newTeamTrack} onValueChange={setNewTeamTrack}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Track" />
                        </SelectTrigger>
                        <SelectContent>
                          {tracks.map((t: any) => (
                            <SelectItem key={t.id || t._id} value={t.id || t._id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="track"
                        value={newTeamTrack}
                        onChange={(e) => setNewTeamTrack(e.target.value)}
                        placeholder="e.g. AI/ML"
                      />
                    )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName || !newTeamEmail}
                  className="rounded-xl"
                >
                  Create Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-150 overflow-auto rounded-xl border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="font-semibold">Track</TableHead>
                  <TableHead className="font-semibold">Current round</TableHead>
                  {allRounds.map((round: any) => (
                    <TableHead
                      key={round.round_id}
                      className="font-semibold text-center"
                    >
                      Round {round.round_number} Score
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-center">
                    Total Score
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell>
                        <Skeleton className="h-4 w-32 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 rounded-md" />
                      </TableCell>

                      {allRounds.map((round: any) => (
                        <TableCell key={round.round_id} className="text-center">
                          <Skeleton className="mx-auto h-4 w-10 rounded-md" />
                        </TableCell>
                      ))}

                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-4 w-12 rounded-md" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  teams.map((team: any) => (
                    <TableRow
                      key={team.id}
                      className="border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{team.team_name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {team.track ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {team.current_round_name ?? "—"}
                      </TableCell>

                      {allRounds.map((round: any) => {
                        const roundScore = team.round_scores?.find(
                          (rs: any) => rs.round_id === round.round_id
                        );
                        return (
                          <TableCell
                            key={round.round_id}
                            className="text-center font-medium"
                          >
                            {roundScore?.score ?? "—"}
                          </TableCell>
                        );
                      })}

                      <TableCell className="text-center font-semibold">
                        {team.round_scores?.reduce(
                          (sum: number, rs: any) => sum + (rs.score || 0),
                          0
                        ) ?? "—"}
                      </TableCell>

                      <TableCell>
                        <Badge>{team.submission_status}</Badge>
                      </TableCell>

                      <TableCell>
                        <Link href={`/admin/teams/${team.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                            <Eye className="size-4" /> View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
