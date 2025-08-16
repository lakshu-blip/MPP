import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RevisionModalProps {
  problem: any;
  userProgress: any;
  open: boolean;
  onClose: () => void;
}

export default function RevisionModal({ problem, userProgress, open, onClose }: RevisionModalProps) {
  const [currentStep, setCurrentStep] = useState<'problem' | 'solution' | 'summary'>('problem');

  const nextStep = () => {
    if (currentStep === 'problem') setCurrentStep('solution');
    else if (currentStep === 'solution') setCurrentStep('summary');
  };

  const resetSteps = () => {
    setCurrentStep('problem');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-dark-primary border-dark-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center justify-between">
            <span>Revision: {problem?.title}</span>
            <div className="flex items-center space-x-2">
              <Badge className={`${
                problem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                problem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {problem?.difficulty}
              </Badge>
              {problem?.patterns && problem.patterns[0] && (
                <Badge className="bg-accent-blue/20 text-accent-blue">
                  {problem.patterns[0]}
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            currentStep === 'problem' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-dark-surface text-text-secondary'
          }`}>
            <span>1</span>
            <span>Problem Recall</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            currentStep === 'solution' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-dark-surface text-text-secondary'
          }`}>
            <span>2</span>
            <span>Solution Review</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            currentStep === 'summary' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-dark-surface text-text-secondary'
          }`}>
            <span>3</span>
            <span>Your Solution</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Problem Recall */}
          {currentStep === 'problem' && (
            <div className="space-y-4">
              <div className="bg-dark-secondary rounded-lg p-4">
                <h3 className="text-lg font-medium text-text-primary mb-3">Problem Statement</h3>
                <p className="text-text-secondary leading-relaxed">{problem?.description}</p>
                
                {problem?.topics && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {problem.topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="bg-dark-surface text-text-secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-dark-secondary rounded-lg p-4">
                <h4 className="text-text-primary font-medium mb-2">Try to recall:</h4>
                <ul className="text-text-secondary text-sm space-y-1">
                  <li>• What approach did you use?</li>
                  <li>• What was the key insight?</li>
                  <li>• What was the time/space complexity?</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={nextStep}
                  className="bg-accent-blue hover:bg-accent-blue/80 text-dark-primary"
                >
                  Show Solution →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Solution Review */}
          {currentStep === 'solution' && (
            <div className="space-y-4">
              <div className="bg-dark-secondary rounded-lg p-4">
                <h3 className="text-lg font-medium text-text-primary mb-3">Optimal Solution</h3>
                <pre className="bg-dark-surface p-4 rounded text-sm overflow-x-auto">
                  <code className="text-text-primary">{problem?.solution}</code>
                </pre>
              </div>

              {problem?.timeComplexity && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-secondary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">Time Complexity</h4>
                    <p className="text-accent-green font-mono">{problem.timeComplexity}</p>
                  </div>
                  <div className="bg-dark-secondary rounded-lg p-4">
                    <h4 className="text-text-primary font-medium mb-2">Space Complexity</h4>
                    <p className="text-accent-green font-mono">{problem.spaceComplexity}</p>
                  </div>
                </div>
              )}

              {problem?.hints && problem.hints.length > 0 && (
                <div className="bg-dark-secondary rounded-lg p-4">
                  <h4 className="text-text-primary font-medium mb-2">Key Insights</h4>
                  <ul className="text-text-secondary text-sm space-y-1">
                    {problem.hints.map((hint: string, index: number) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={nextStep}
                  className="bg-accent-green hover:bg-accent-green/80 text-dark-primary"
                >
                  Show My Solution →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Your Solution */}
          {currentStep === 'summary' && (
            <div className="space-y-4">
              <div className="bg-dark-secondary rounded-lg p-4">
                <h3 className="text-lg font-medium text-text-primary mb-3">Your Approach</h3>
                {userProgress?.patternNotes ? (
                  <p className="text-accent-green text-lg italic">"{userProgress.patternNotes}"</p>
                ) : (
                  <p className="text-text-secondary">No summary saved yet</p>
                )}
              </div>

              <div className="bg-dark-secondary rounded-lg p-4">
                <h3 className="text-lg font-medium text-text-primary mb-3">Your Code</h3>
                {userProgress?.userSolution ? (
                  <pre className="bg-dark-surface p-4 rounded text-sm overflow-x-auto">
                    <code className="text-text-primary">{userProgress.userSolution}</code>
                  </pre>
                ) : (
                  <p className="text-text-secondary">No code saved yet</p>
                )}
              </div>

              {userProgress?.notes && (
                <div className="bg-dark-secondary rounded-lg p-4">
                  <h3 className="text-lg font-medium text-text-primary mb-3">Pattern Notes</h3>
                  <p className="text-text-secondary">{userProgress.notes}</p>
                </div>
              )}

              <Separator className="bg-dark-border" />
              
              <div className="text-center text-sm text-text-secondary">
                <p>This problem will appear for revision again based on spaced repetition algorithm</p>
                <p className="text-xs mt-1">Next revision: {userProgress?.nextRevisionDate ? new Date(userProgress.nextRevisionDate).toLocaleDateString() : 'Not scheduled'}</p>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={resetSteps}
                  variant="outline"
                  className="border-dark-border text-text-secondary"
                >
                  Review Again
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-accent-purple hover:bg-accent-purple/80 text-dark-primary"
                >
                  Mark Revised
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}