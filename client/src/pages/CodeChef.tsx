import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID } from "@/lib/constants";
import type { Problem } from "@shared/schema";

interface CodeChefStats {
  currentRating: number;
  targetRating: number;
  problemsSolved: number;
  recentProgress: Array<{
    date: string;
    rating: number;
    contestName: string;
  }>;
  suggestedProblems: Problem[];
}

export default function CodeChef() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate time left until end of year
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      const diff = endOfYear.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days, hours, minutes });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const { data: stats, isLoading } = useQuery<CodeChefStats>({
    queryKey: ['/api/codechef/stats', CURRENT_USER_ID],
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const syncRatingMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/codechef/sync-rating/${CURRENT_USER_ID}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/codechef/stats'] });
      toast({
        title: "Rating Synced! 🎯",
        description: "Your latest CodeChef rating has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to fetch latest rating. Please check your CodeChef username in settings.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <CodeChefSkeleton />;
  }

  const currentRating = stats?.currentRating || 1400;
  const targetRating = 2100; // 3★ rating
  const ratingProgress = ((currentRating - 1000) / (targetRating - 1000)) * 100;
  const ratingDifference = targetRating - currentRating;
  
  // Estimate feasibility based on typical progress rates
  const weeksLeft = Math.ceil(timeLeft.days / 7);
  const requiredWeeklyProgress = ratingDifference / weeksLeft;
  const isFeasible = requiredWeeklyProgress <= 50; // Realistic weekly progress

  const getRatingEmoji = (rating: number) => {
    if (rating < 1400) return "🌱"; // 1★
    if (rating < 1600) return "⭐"; // 2★
    if (rating < 2100) return "⭐⭐"; // 2★
    if (rating < 2500) return "⭐⭐⭐"; // 3★
    if (rating < 3000) return "⭐⭐⭐⭐"; // 4★
    return "⭐⭐⭐⭐⭐"; // 5★
  };

  const getFeasibilityStatus = () => {
    if (isFeasible) return { color: "text-accent-green", emoji: "✅", text: "Achievable with consistent practice" };
    if (requiredWeeklyProgress <= 80) return { color: "text-accent-orange", emoji: "⚠️", text: "Challenging but possible with intensive practice" };
    return { color: "text-accent-red", emoji: "❌", text: "Very ambitious - consider extending timeline" };
  };

  const feasibilityStatus = getFeasibilityStatus();

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary flex items-center">
                🏆 CodeChef Progress Tracker
              </h2>
              <p className="text-text-secondary">Path to 3★ rating by year-end</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => syncRatingMutation.mutate()}
                disabled={syncRatingMutation.isPending}
                className="bg-dark-surface border-dark-border hover:bg-dark-border"
                data-testid="button-sync-rating"
              >
                {syncRatingMutation.isPending ? (
                  <>⏳ Syncing...</>
                ) : (
                  <>🔄 Sync Rating</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Rating Progress Card */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-text-primary">
              <span>Current Progress {getRatingEmoji(currentRating)}</span>
              <div className="text-right text-sm">
                <div className="text-2xl font-bold text-accent-blue">{currentRating}</div>
                <div className="text-text-secondary">/ {targetRating}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">Rating Progress</span>
                <span className="text-sm text-text-primary">{Math.round(ratingProgress)}%</span>
              </div>
              <Progress value={ratingProgress} className="w-full h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-dark-primary rounded-lg">
                <div className="text-xl font-bold text-accent-blue">{ratingDifference}</div>
                <div className="text-xs text-text-secondary">Rating Points Needed</div>
              </div>
              <div className="text-center p-4 bg-dark-primary rounded-lg">
                <div className="text-xl font-bold text-accent-orange">{timeLeft.days}</div>
                <div className="text-xs text-text-secondary">Days Remaining</div>
              </div>
              <div className="text-center p-4 bg-dark-primary rounded-lg">
                <div className="text-xl font-bold text-accent-green">{Math.ceil(requiredWeeklyProgress)}</div>
                <div className="text-xs text-text-secondary">Points/Week Needed</div>
              </div>
            </div>

            <div className="bg-dark-primary p-4 rounded-lg border-l-4 border-accent-purple">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{feasibilityStatus.emoji}</span>
                <span className={`font-medium ${feasibilityStatus.color}`}>
                  {feasibilityStatus.text}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Countdown */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-text-primary mb-4">⏰ Time Until Year End</h3>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-blue">{timeLeft.days}</div>
                  <div className="text-sm text-text-secondary">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-orange">{timeLeft.hours}</div>
                  <div className="text-sm text-text-secondary">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-green">{timeLeft.minutes}</div>
                  <div className="text-sm text-text-secondary">Minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Problems for Rating Growth */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary">
              🎯 Recommended Problems for Rating Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Coming Soon!</h3>
              <p className="text-text-secondary">
                AI-powered problem recommendations based on your current rating and target goals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Practice Schedule */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary">
              📅 Weekly Practice Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Daily Targets 🎯</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <span>🟢</span>
                    <span>2-3 problems (rating: {currentRating - 200} - {currentRating})</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🟡</span>
                    <span>1-2 problems (rating: {currentRating} - {currentRating + 200})</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🔴</span>
                    <span>1 problem (rating: {currentRating + 200}+)</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Contest Strategy 🏁</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Participate in 2-3 contests weekly</li>
                  <li>• Focus on accuracy over speed initially</li>
                  <li>• Review editorial for unsolved problems</li>
                  <li>• Practice virtual contests for timing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CodeChefSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}