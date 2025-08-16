import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ProblemWithProgress } from "@/lib/types";

interface ProblemModalProps {
  problem: ProblemWithProgress;
  open: boolean;
  onClose: () => void;
}

export default function ProblemModal({ problem, open, onClose }: ProblemModalProps) {
  const [userSolution, setUserSolution] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmitSolution = () => {
    // TODO: Implement solution submission
    toast({
      title: "Solution Submitted",
      description: "Your solution has been saved successfully!",
    });
  };

  const handleMarkComplete = () => {
    // TODO: Implement problem completion
    toast({
      title: "Problem Completed",
      description: `Great job completing "${problem.title}"!`,
    });
    onClose();
  };

  const getDifficultyClass = (difficulty: string) => {
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-dark-secondary border-dark-border text-text-primary overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{problem.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyClass(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              {problem.leetcodeId && (
                <Badge variant="outline" className="border-dark-border text-text-secondary">
                  LC #{problem.leetcodeId}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>{problem.topics?.join(", ")}</span>
            <span>•</span>
            <span>{problem.companies?.join(", ")}</span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="problem" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-dark-surface">
            <TabsTrigger value="problem" data-testid="tab-problem">Problem</TabsTrigger>
            <TabsTrigger value="solution" data-testid="tab-solution">Solution</TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className="bg-dark-surface p-4 rounded-lg">
                  <p className="text-text-secondary whitespace-pre-wrap">
                    {problem.description || "Problem description will be displayed here..."}
                  </p>
                </div>
              </div>

              {problem.patterns && problem.patterns.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Patterns</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.patterns.map((pattern, index) => (
                      <Badge key={index} variant="outline" className="border-accent-blue text-accent-blue">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {problem.hints && problem.hints.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hints</h3>
                  <div className="space-y-2">
                    {problem.hints.map((hint, index) => (
                      <div key={index} className="bg-dark-surface p-3 rounded-lg border-l-4 border-accent-yellow">
                        <p className="text-text-secondary">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {problem.timeComplexity && (
                  <div>
                    <h4 className="font-medium mb-1">Time Complexity</h4>
                    <Badge variant="outline" className="border-accent-green text-accent-green">
                      {problem.timeComplexity}
                    </Badge>
                  </div>
                )}
                {problem.spaceComplexity && (
                  <div>
                    <h4 className="font-medium mb-1">Space Complexity</h4>
                    <Badge variant="outline" className="border-accent-green text-accent-green">
                      {problem.spaceComplexity}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="solution" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Solution</h3>
                <Textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Write your solution here..."
                  className="min-h-[200px] bg-dark-surface border-dark-border text-text-primary font-mono"
                  data-testid="textarea-user-solution"
                />
              </div>

              {problem.solution && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Optimal Solution</h3>
                  <div className="bg-dark-surface p-4 rounded-lg">
                    <pre className="text-text-secondary font-mono text-sm whitespace-pre-wrap">
                      {problem.solution}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmitSolution}
                  className="bg-accent-blue hover:bg-accent-blue/80"
                  data-testid="button-submit-solution"
                >
                  <i className="fas fa-save mr-2"></i>Save Solution
                </Button>
                <Button
                  onClick={handleMarkComplete}
                  className="bg-accent-green hover:bg-accent-green/80"
                  data-testid="button-mark-complete"
                >
                  <i className="fas fa-check mr-2"></i>Mark Complete
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Notes</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes, insights, or reminders here..."
                  className="min-h-[200px] bg-dark-surface border-dark-border text-text-primary"
                  data-testid="textarea-notes"
                />
              </div>

              <Button
                onClick={() => {
                  // TODO: Save notes
                  toast({
                    title: "Notes Saved",
                    description: "Your notes have been saved successfully!",
                  });
                }}
                className="bg-accent-purple hover:bg-accent-purple/80"
                data-testid="button-save-notes"
              >
                <i className="fas fa-save mr-2"></i>Save Notes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attempt History</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-dark-surface p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent-blue">
                    {problem.attempts || 0}
                  </p>
                  <p className="text-xs text-text-secondary">Total Attempts</p>
                </div>
                <div className="bg-dark-surface p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent-green">
                    {problem.successfulAttempts || 0}
                  </p>
                  <p className="text-xs text-text-secondary">Successful</p>
                </div>
                <div className="bg-dark-surface p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent-orange">
                    {problem.attempts && problem.successfulAttempts 
                      ? Math.round((problem.successfulAttempts / problem.attempts) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-text-secondary">Success Rate</p>
                </div>
                <div className="bg-dark-surface p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-text-muted">0</p>
                  <p className="text-xs text-text-secondary">Mistakes</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="bg-dark-surface p-3 rounded-lg flex items-center space-x-3">
                    <i className="fas fa-clock text-accent-blue"></i>
                    <div>
                      <p className="text-sm">Last attempted 2 hours ago</p>
                      <p className="text-xs text-text-secondary">Status: In Progress</p>
                    </div>
                  </div>
                  <div className="bg-dark-surface p-3 rounded-lg flex items-center space-x-3">
                    <i className="fas fa-lightbulb text-accent-yellow"></i>
                    <div>
                      <p className="text-sm">Added pattern note</p>
                      <p className="text-xs text-text-secondary">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogClose asChild>
          <Button
            variant="outline"
            className="mt-4 border-dark-border hover:bg-dark-surface"
            data-testid="button-close-modal"
          >
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
