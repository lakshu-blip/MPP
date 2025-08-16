import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID } from "@/lib/constants";
import type { Problem, UserProgress } from "@shared/schema";

interface RevisionModalProps {
  problem: Problem & { progress?: UserProgress };
  open: boolean;
  onClose: () => void;
}

type RevisionStep = 'problem_recall' | 'pattern_notes' | 'code_review';
type RecallDifficulty = 'easy' | 'medium' | 'hard';

export default function RevisionModal({ problem, open, onClose }: RevisionModalProps) {
  const [currentStep, setCurrentStep] = useState<RevisionStep>('problem_recall');
  const [recallDifficulty, setRecallDifficulty] = useState<RecallDifficulty | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [userAttempt, setUserAttempt] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setCurrentStep('problem_recall');
      setRecallDifficulty(null);
      setStartTime(Date.now());
      setUserAttempt("");
    }
  }, [open]);

  const completeRevisionMutation = useMutation({
    mutationFn: (data: {
      problemId: string;
      recallDifficulty: RecallDifficulty;
      timeSpent: number;
    }) => apiRequest('POST', `/api/revision/complete`, {
      userId: CURRENT_USER_ID,
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      onClose();
    },
  });

  const handleStepComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    if (currentStep === 'problem_recall') {
      setCurrentStep('pattern_notes');
    } else if (currentStep === 'pattern_notes') {
      setCurrentStep('code_review');
    } else if (currentStep === 'code_review' && recallDifficulty) {
      // Complete the revision session
      completeRevisionMutation.mutate({
        problemId: problem.id,
        recallDifficulty,
        timeSpent
      });
    }
  };

  const handleRecallDifficulty = (difficulty: RecallDifficulty) => {
    setRecallDifficulty(difficulty);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'problem_recall':
        return 'Step 1: Problem Recall';
      case 'pattern_notes':
        return 'Step 2: Pattern & Logic Review';
      case 'code_review':
        return 'Step 3: Code Implementation Review';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'problem_recall':
        return 'Try to recall and solve this problem like a flashcard. Think through your approach before proceeding.';
      case 'pattern_notes':
        return 'Review your notes and the key pattern/logic behind this problem.';
      case 'code_review':
        return 'Study your complete solution with comments to reinforce implementation details.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-secondary border-dark-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center justify-between">
            <div>
              <span className="text-2xl">{getStepTitle()}</span>
              <div className="flex items-center space-x-2 mt-2">
                {problem.companies && problem.companies[0] && problem.companies[0].startsWith('Pattern') && (
                  <Badge className="bg-accent-blue/20 text-accent-blue">
                    {problem.companies[0]}
                  </Badge>
                )}
                <Badge variant="outline" className="border-dark-border text-text-secondary">
                  {problem.difficulty}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${currentStep === 'problem_recall' ? 'bg-accent-blue' : 'bg-accent-green'}`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'pattern_notes' ? 'bg-accent-blue' : currentStep === 'code_review' ? 'bg-accent-green' : 'bg-dark-surface'}`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'code_review' ? 'bg-accent-blue' : 'bg-dark-surface'}`}></div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Description */}
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4">
              <p className="text-text-secondary">{getStepDescription()}</p>
            </CardContent>
          </Card>

          {/* Problem Statement (Always Visible) */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center">
                <i className="fas fa-file-alt mr-2 text-accent-blue"></i>
                {problem.title}
                {problem.companies && problem.companies[1] && (
                  <Badge className="ml-2 bg-accent-purple/20 text-accent-purple">
                    {problem.companies[1]}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-text-secondary whitespace-pre-wrap">{problem.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Problem Recall */}
          {currentStep === 'problem_recall' && (
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="text-text-primary">Your Attempt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your approach, solution, or thoughts here..."
                  value={userAttempt}
                  onChange={(e) => setUserAttempt(e.target.value)}
                  className="min-h-[200px] bg-dark-primary border-dark-border text-text-primary"
                  data-testid="textarea-user-attempt"
                />
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">How difficult was it to recall this problem?</p>
                  <div className="flex space-x-3">
                    {(['easy', 'medium', 'hard'] as RecallDifficulty[]).map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={recallDifficulty === difficulty ? "default" : "outline"}
                        onClick={() => handleRecallDifficulty(difficulty)}
                        className={`${
                          recallDifficulty === difficulty
                            ? 'bg-accent-blue text-white'
                            : 'border-dark-border text-text-secondary hover:text-text-primary'
                        }`}
                        data-testid={`button-recall-${difficulty}`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pattern Notes */}
          {currentStep === 'pattern_notes' && (
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <i className="fas fa-lightbulb mr-2 text-accent-yellow"></i>
                  Pattern & Logic Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-dark-primary p-4 rounded-lg border border-accent-blue/20">
                  <h4 className="font-medium text-text-primary mb-2">Key Pattern:</h4>
                  <p className="text-accent-blue">
                    {problem.companies && problem.companies[1] 
                      ? `This problem uses the ${problem.companies[1]} pattern. Focus on the core algorithm and approach.`
                      : 'Fundamental algorithmic pattern - analyze the problem structure and choose the optimal approach.'
                    }
                  </p>
                </div>

                {problem.progress?.notes && (
                  <div className="bg-dark-primary p-4 rounded-lg border border-dark-border">
                    <h4 className="font-medium text-text-primary mb-2">Your Personal Notes:</h4>
                    <p className="text-text-secondary whitespace-pre-wrap">{problem.progress.notes}</p>
                  </div>
                )}

                <div className="bg-dark-primary p-4 rounded-lg border border-dark-border">
                  <h4 className="font-medium text-text-primary mb-2">Algorithm Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Time Complexity: </span>
                      <span className="text-accent-green">{problem.timeComplexity || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Space Complexity: </span>
                      <span className="text-accent-green">{problem.spaceComplexity || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {problem.hints && problem.hints.length > 0 && (
                  <div className="bg-dark-primary p-4 rounded-lg border border-dark-border">
                    <h4 className="font-medium text-text-primary mb-2">Hints:</h4>
                    <ul className="text-text-secondary space-y-1">
                      {problem.hints.map((hint, index) => (
                        <li key={index}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Code Review */}
          {currentStep === 'code_review' && (
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <i className="fas fa-code mr-2 text-accent-green"></i>
                  Code Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {problem.progress?.userSolution ? (
                  <div className="bg-dark-primary p-4 rounded-lg border border-dark-border">
                    <h4 className="font-medium text-text-primary mb-2">Your Solution:</h4>
                    <pre className="text-sm text-accent-green overflow-x-auto">
                      <code>{problem.progress.userSolution}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="bg-dark-primary p-4 rounded-lg border border-dark-border">
                    <h4 className="font-medium text-text-primary mb-2">Optimal Solution:</h4>
                    <pre className="text-sm text-accent-green overflow-x-auto">
                      <code>{problem.solution || 'No solution code available'}</code>
                    </pre>
                  </div>
                )}

                <div className="bg-accent-blue/10 p-4 rounded-lg border border-accent-blue/20">
                  <h4 className="font-medium text-text-primary mb-2">Review Checklist:</h4>
                  <ul className="text-text-secondary space-y-2">
                    <li>✓ Understand the algorithm approach and pattern</li>
                    <li>✓ Review edge cases and their handling</li>
                    <li>✓ Confirm time and space complexity analysis</li>
                    <li>✓ Note any optimization opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-dark-border text-text-secondary"
            >
              Close
            </Button>
            
            <Button
              onClick={handleStepComplete}
              disabled={currentStep === 'problem_recall' && !recallDifficulty}
              className="bg-accent-blue hover:bg-accent-blue/80 text-white"
              data-testid="button-continue"
            >
              {currentStep === 'code_review' ? 'Complete Revision' : 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}