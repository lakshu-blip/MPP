import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CompletionModalProps {
  problem: any;
  open: boolean;
  onClose: () => void;
}

export default function CompletionModal({ problem, open, onClose }: CompletionModalProps) {
  const [oneLinerSummary, setOneLinerSummary] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [patternNotes, setPatternNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeProblemMutation = useMutation({
    mutationFn: async (data: {
      problemId: string;
      oneLinerSummary: string;
      codeSnippet: string;
      patternNotes: string;
    }) => {
      return apiRequest(`/api/problems/${data.problemId}/complete`, 'POST', {
        userId: 'user1', // In real app, get from auth context
        oneLinerSummary: data.oneLinerSummary,
        codeSnippet: data.codeSnippet,
        notes: data.patternNotes,
        timeSpent: 0, // Could be tracked with timer
      });
    },
    onSuccess: () => {
      toast({
        title: "Problem Completed!",
        description: "Your progress has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      onClose();
      setOneLinerSummary("");
      setCodeSnippet("");
      setPatternNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark problem as complete. Please try again.",
        variant: "destructive",
      });
      console.error("Error completing problem:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneLinerSummary.trim()) {
      toast({
        title: "Required Field",
        description: "Please provide a one-liner summary of your solution approach.",
        variant: "destructive",
      });
      return;
    }
    if (!codeSnippet.trim()) {
      toast({
        title: "Required Field", 
        description: "Please provide your code solution.",
        variant: "destructive",
      });
      return;
    }

    completeProblemMutation.mutate({
      problemId: problem.id,
      oneLinerSummary,
      codeSnippet,
      patternNotes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-dark-primary border-dark-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Mark Problem as Complete: {problem?.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-text-primary">
              One-Liner Summary <span className="text-red-400">*</span>
            </Label>
            <p className="text-sm text-text-secondary">
              Briefly explain your solution approach (e.g., "Used two pointers from both ends to find max area")
            </p>
            <Textarea
              id="summary"
              value={oneLinerSummary}
              onChange={(e) => setOneLinerSummary(e.target.value)}
              placeholder="e.g., Used hash map to store complements and find target sum in single pass"
              className="bg-dark-secondary border-dark-border text-text-primary"
              rows={2}
              data-testid="input-summary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-text-primary">
              Your Code Solution <span className="text-red-400">*</span>
            </Label>
            <p className="text-sm text-text-secondary">
              Paste your working code solution with comments
            </p>
            <Textarea
              id="code"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="function twoSum(nums, target) {
  // Your solution code here
  const map = new Map();
  // ... rest of your implementation
}"
              className="bg-dark-secondary border-dark-border text-text-primary font-mono text-sm"
              rows={8}
              data-testid="input-code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern" className="text-text-primary">
              Pattern Notes (Optional)
            </Label>
            <p className="text-sm text-text-secondary">
              Key insights about the pattern or algorithm used
            </p>
            <Textarea
              id="pattern"
              value={patternNotes}
              onChange={(e) => setPatternNotes(e.target.value)}
              placeholder="e.g., Two pointers pattern works well when array is sorted or when we need to find pairs"
              className="bg-dark-secondary border-dark-border text-text-primary"
              rows={3}
              data-testid="input-pattern-notes"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={completeProblemMutation.isPending}
              className="border-dark-border text-text-secondary"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={completeProblemMutation.isPending}
              className="bg-accent-green hover:bg-accent-green/80 text-dark-primary"
              data-testid="button-complete"
            >
              {completeProblemMutation.isPending ? "Saving..." : "Mark Complete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}