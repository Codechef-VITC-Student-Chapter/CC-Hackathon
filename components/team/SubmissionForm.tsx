"use client";

import React, { useState } from "react";
import type { SubtaskSummary } from "./SubtaskCard";
import { useSubmitProjectMutation } from "@/lib/redux/api/teamApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Props = {
  subtask: SubtaskSummary;
  allowFileUpload?: boolean;
  roundId?: string | undefined;
  onFinalSubmitted?: (payload: {
    subtaskId: string;
    githubUrl?: string;
    docUrl?: string;
    fileName?: string;
  }) => void;
};

export default function SubmissionForm({
  subtask,
  onFinalSubmitted,
  allowFileUpload,
  roundId,
}: Props) {
  const [githubUrl, setGithubUrl] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [overview, setOverview] = useState("");
  const [busy, setBusy] = useState(false);
  const [final, setFinal] = useState(false);

  // RTK Query hook
  const [submitProject, { isLoading }] = useSubmitProjectMutation();

  const canSubmit = (githubUrl || docUrl) && !isLoading && !final;

  async function handleFinalSubmit() {
    if (!canSubmit) return;

    try {
      const payload = {
        roundId: roundId ?? "",
        subtaskId: subtask.id,
        fileUrl: docUrl,
        githubLink: githubUrl,
        overview: overview,
      };

      await submitProject(payload).unwrap();

      setFinal(true);
      onFinalSubmitted?.({
        subtaskId: subtask.id,
        githubUrl,
        docUrl,
        fileName: overview ? "Overview provided" : undefined,
      });
    } catch (e: any) {
      console.error(e);
      alert("Submission failed: " + (e?.data?.error || "Unknown error"));
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
        <p className="text-xs font-medium text-muted-foreground">
          SUBMITTING FOR
        </p>
        <p className="text-lg font-semibold text-foreground mt-1">
          {subtask.title}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="github-url">GitHub Repository URL</Label>
          <Input
            id="github-url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/your-repo"
            type="url"
            disabled={final}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doc-url">Presentation Link / Document URL</Label>
          <Input
            id="doc-url"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://drive.google.com/your-doc"
            type="url"
            disabled={final}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overview">Project Overview (Optional)</Label>
          <Textarea
            id="overview"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Brief description of your project..."
            rows={4}
            disabled={final}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleFinalSubmit}
          disabled={!canSubmit || final}
          className="w-full"
          size="lg"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {final
            ? "Submitted Successfully"
            : isLoading
              ? "Submitting..."
              : "Final Submit"}
        </Button>
      </div>
    </div>
  );
}
