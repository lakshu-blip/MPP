import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID, API_ENDPOINTS } from "@/lib/constants";
import RevisionModal from "@/components/RevisionModal";
import type { ScheduleDay } from "@/lib/types";
import type { Problem, UserProgress } from "@shared/schema";

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(3);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<(Problem & { progress?: UserProgress }) | null>(null);
  const { toast } = useToast();

  const { data: schedules, isLoading } = useQuery<ScheduleDay[]>({
    queryKey: [API_ENDPOINTS.SCHEDULE, CURRENT_USER_ID],
  });

  const { data: revisionProblems = [] } = useQuery<(Problem & { progress: UserProgress })[]>({
    queryKey: ['/api/revision/due', CURRENT_USER_ID],
  });

  const handleGenerateSchedule = async () => {
    try {
      await apiRequest("POST", `${API_ENDPOINTS.SCHEDULE}/generate/${CURRENT_USER_ID}`, {});
      toast({
        title: "Schedule Generated",
        description: "Your 60-day learning schedule has been created successfully!",
      });
      // Refetch schedules
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportSchedule = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export Started",
      description: "Your schedule is being prepared for download...",
    });
  };

  if (isLoading) {
    return <ScheduleSkeleton />;
  }

  const weekSchedules = schedules?.slice((currentWeek - 1) * 7, currentWeek * 7) || [];
  const totalCompleted = schedules?.filter(s => s.isCompleted).length || 87;
  const totalInProgress = schedules?.filter(s => !s.isCompleted && s.completedCount > 0).length || 6;
  const totalRemaining = (schedules?.length || 350) - totalCompleted - totalInProgress;
  const totalRevisions = revisionProblems.length;

  const overallProgress = schedules?.length ? (totalCompleted / schedules.length) * 100 : 25;

  const handleRevisionClick = (problem: Problem & { progress: UserProgress }) => {
    setSelectedProblem(problem);
    setRevisionModalOpen(true);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">60-Day Schedule</h2>
              <p className="text-text-secondary">Your personalized learning path to FAANG readiness</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleExportSchedule}
                className="bg-dark-surface border-dark-border hover:bg-dark-border"
                data-testid="button-export-schedule"
              >
                <i className="fas fa-download mr-2"></i>Export Schedule
              </Button>
              <Button
                onClick={handleGenerateSchedule}
                className="bg-accent-blue hover:bg-accent-blue/80"
                data-testid="button-generate-schedule"
              >
                <i className="fas fa-sync mr-2"></i>Regenerate
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Progress Overview */}
        <Card className="bg-dark-secondary border-dark-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-text-primary">
              <span>Schedule Progress</span>
              <span className="text-sm text-text-secondary font-normal">
                Day 15 of 60 • {Math.round(overallProgress)}% Complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="mb-4 h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent-green" data-testid="stat-completed">
                  {totalCompleted}
                </p>
                <p className="text-xs text-text-secondary">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-blue" data-testid="stat-in-progress">
                  {totalInProgress}
                </p>
                <p className="text-xs text-text-secondary">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-muted" data-testid="stat-remaining">
                  {totalRemaining}
                </p>
                <p className="text-xs text-text-secondary">Remaining</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-purple" data-testid="stat-revisions">
                  {totalRevisions}
                </p>
                <p className="text-xs text-text-secondary">Revisions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly View */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader className="border-b border-dark-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-text-primary">
                Week {currentWeek} - December 2-8, 2024
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                  disabled={currentWeek <= 1}
                  data-testid="button-previous-week"
                >
                  <i className="fas fa-chevron-left text-text-muted"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.min(9, currentWeek + 1))}
                  disabled={currentWeek >= 9}
                  data-testid="button-next-week"
                >
                  <i className="fas fa-chevron-right text-text-muted"></i>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-border">
              {weekSchedules.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="fas fa-calendar-alt text-4xl text-text-muted mb-4"></i>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No schedule generated yet</h3>
                  <p className="text-text-secondary mb-4">
                    Generate your personalized 60-day learning schedule to get started.
                  </p>
                  <Button
                    onClick={handleGenerateSchedule}
                    className="bg-accent-blue hover:bg-accent-blue/80"
                  >
                    <i className="fas fa-magic mr-2"></i>Generate Schedule
                  </Button>
                </div>
              ) : (
                weekSchedules.map((day) => (
                  <DaySchedule key={day.id} day={day} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revision Modal */}
      {selectedProblem && (
        <RevisionModal
          problem={selectedProblem}
          open={revisionModalOpen}
          onClose={() => {
            setRevisionModalOpen(false);
            setSelectedProblem(null);
          }}
        />
      )}
    </div>
  );
}

function DaySchedule({ day }: { day: ScheduleDay }) {
  const completedTasks = day.completedCount || 3;
  const totalTasks = day.totalCount || 6;
  const remainingTasks = totalTasks - completedTasks;

  // Mock problems for demonstration
  const mockProblems = [
    { id: "1", title: "Binary Tree Inorder Traversal", difficulty: "Easy", topic: "Trees, Recursion", completed: true },
    { id: "2", title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees, BST", completed: true },
    { id: "3", title: "Maximum Subarray (Revision)", difficulty: "Medium", topic: "Arrays, DP", completed: false, isRevision: true },
    { id: "4", title: "Graph Valid Tree", difficulty: "Medium", topic: "Graphs, Union Find", completed: false },
    { id: "5", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees, Design", completed: false },
  ];

  return (
    <div className="p-4" data-testid={`day-schedule-${day.day}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-sm font-medium text-white">
            {day.day}
          </div>
          <div>
            <h4 className="font-medium text-text-primary">
              Day {day.day} - Trees & Graphs Focus
            </h4>
            <p className="text-xs text-text-secondary">
              {day.day === 15 ? "Today, " : ""}December {day.day % 30 || 1}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-accent-green text-dark-primary">
            {completedTasks} completed
          </Badge>
          <Badge className="bg-accent-orange text-dark-primary">
            {remainingTasks} remaining
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockProblems.map((problem) => (
          <ProblemTask key={problem.id} problem={problem} />
        ))}
        
        {/* Flashcard Task */}
        <div className="bg-dark-surface p-3 rounded border border-accent-cyan">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-accent-cyan text-dark-primary">Flashcards</Badge>
            <i className="fas fa-cards-blank text-accent-cyan"></i>
          </div>
          <h5 className="text-sm font-medium text-text-primary">Tree Patterns Review</h5>
          <p className="text-xs text-text-secondary mt-1">5 cards to review</p>
        </div>
      </div>
    </div>
  );
}

function ProblemTask({ problem }: { problem: any }) {
  const getBorderColor = () => {
    if (problem.completed) return "border-accent-green";
    if (problem.isRevision) return "border-accent-purple";
    return "border-text-muted";
  };

  const getStatusIcon = () => {
    if (problem.completed) return "fa-check text-accent-green";
    if (problem.isRevision) return "fa-redo text-accent-purple";
    return "fa-circle text-text-muted";
  };

  const getDifficultyClass = (difficulty: string) => {
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  return (
    <div className={`bg-dark-surface p-3 rounded border-l-4 ${getBorderColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <Badge className={getDifficultyClass(problem.difficulty)}>
          {problem.difficulty}
        </Badge>
        <i className={`fas ${getStatusIcon()}`}></i>
      </div>
      <h5 className="text-sm font-medium text-text-primary">{problem.title}</h5>
      <p className="text-xs text-text-secondary mt-1">{problem.topic}</p>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-6">
        <Skeleton className="h-40 w-full mb-6" />
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader className="border-b border-dark-border">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
