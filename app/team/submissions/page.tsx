import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamSubmissionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">View your submission history.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-slate-100 p-3 mb-4 dark:bg-slate-800">
              <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">No submissions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You haven't made any submissions yet. Once you submit a project for a round, it will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
