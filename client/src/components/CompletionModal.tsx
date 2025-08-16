import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID } from "@/lib/constants";
import type { Problem } from "@shared/schema";

interface CompletionModalProps {
  problem: Problem | null;
  open: boolean;
  onClose: () => void;
}

export default function CompletionModal({ problem, open, onClose }: CompletionModalProps) {
  const [oneLinerSummary, setOneLinerSummary] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [timeSpent, setTimeSpent] = useState(30); // minutes
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeProblemMutation = useMutation({
    mutationFn: (data: {
      oneLinerSummary: string;
      codeSnippet: string;
      timeSpent: number;
      notes: string;
    }) =>
      apiRequest(
        "POST",
        `/api/problems/${problem?.id}/complete`,
        {
          userId: CURRENT_USER_ID,
          ...data
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      
      toast({
        title: "Problem Completed! 🎉",
        description: "Your solution and notes have been saved automatically.",
      });
      
      // Reset form and close modal
      setOneLinerSummary("");
      setCodeSnippet("");
      setAdditionalNotes("");
      setTimeSpent(30);
      onClose();
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save your completion. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!oneLinerSummary.trim()) {
      toast({
        title: "One-liner Required",
        description: "Please add a brief summary of your approach.",
        variant: "destructive",
      });
      return;
    }

    completeProblemMutation.mutate({
      oneLinerSummary: oneLinerSummary.trim(),
      codeSnippet: codeSnippet.trim(),
      timeSpent: timeSpent * 60, // Convert to seconds
      notes: additionalNotes.trim()
    });
  };

  if (!problem) return null;

  const getPatternInfo = () => {
    if (problem.companies && problem.companies.length >= 2 && problem.companies[0].startsWith('Pattern')) {
      return {
        number: parseInt(problem.companies[0].replace('Pattern ', '')),
        name: problem.companies[1]
      };
    }
    return null;
  };

  const patternInfo = getPatternInfo();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-secondary border-dark-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center justify-between">
            <div>
              <span className="text-2xl">🎉 Problem Completed!</span>
              <div className="flex items-center space-x-2 mt-2">
                {patternInfo && (
                  <Badge className="bg-accent-blue/20 text-accent-blue">
                    Pattern {patternInfo.number}
                  </Badge>
                )}
                <Badge variant="outline" className="border-dark-border text-text-secondary">
                  {problem.difficulty}
                </Badge>
                <span className="text-lg">{problem.difficulty === 'Easy' ? '🟢' : problem.difficulty === 'Medium' ? '🟡' : '🔴'}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Problem Info */}
          <Card className="bg-dark-primary border-dark-border">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center">
                <i className="fas fa-check-circle mr-2 text-accent-green"></i>
                {problem.title}
                {patternInfo && (
                  <Badge className="ml-2 bg-accent-purple/20 text-accent-purple">
                    {patternInfo.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Auto-save Form */}
          <div className="grid grid-cols-1 gap-6">
            {/* One-liner Summary */}
            <Card className="bg-dark-primary border-dark-border">
              <CardHeader>
                <CardTitle className="text-text-primary text-lg">
                  📝 One-liner Summary (Required)
                </CardTitle>
                <p className="text-sm text-text-secondary">
                  Brief explanation of your approach - this will be used for quick revision
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={oneLinerSummary}
                  onChange={(e) => setOneLinerSummary(e.target.value)}
                  placeholder="e.g., Used two pointers technique to find target sum in sorted array..."
                  className="min-h-[80px] bg-dark-surface border-dark-border text-text-primary resize-none"
                  data-testid="input-one-liner"
                />
              </CardContent>
            </Card>

            {/* Code Snippet */}
            <Card className="bg-dark-primary border-dark-border">
              <CardHeader>
                <CardTitle className="text-text-primary text-lg">
                  💻 Your Code Solution
                </CardTitle>
                <p className="text-sm text-text-secondary">
                  Paste your working solution here for future reference
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste your solution here..."
                  className="min-h-[200px] bg-dark-surface border-dark-border text-text-primary font-mono text-sm resize-none"
                  data-testid="input-code-snippet"
                />
              </CardContent>
            </Card>

            {/* Time & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-dark-primary border-dark-border">
                <CardHeader>
                  <CardTitle className="text-text-primary text-lg">
                    ⏱️ Time Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 bg-dark-surface border border-dark-border rounded text-text-primary"
                      min="1"
                      max="300"
                    />
                    <span className="text-text-secondary">minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-primary border-dark-border">
                <CardHeader>
                  <CardTitle className="text-text-primary text-lg">
                    📋 Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional insights or gotchas..."
                    className="h-20 bg-dark-surface border-dark-border text-text-primary resize-none"
                    data-testid="input-additional-notes"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-dark-surface border-dark-border hover:bg-dark-border"
              data-testid="button-cancel-completion"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={completeProblemMutation.isPending || !oneLinerSummary.trim()}
              className="bg-accent-green hover:bg-accent-green/80 text-dark-primary"
              data-testid="button-save-completion"
            >
              {completeProblemMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save & Complete
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}