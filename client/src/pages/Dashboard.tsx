import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENT_USER_ID, API_ENDPOINTS } from "@/lib/constants";
import type { DashboardStats, Activity } from "@/lib/types";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: [API_ENDPOINTS.STATS, CURRENT_USER_ID],
  });

  const { data: todaySchedule, isLoading: scheduleLoading } = useQuery({
    queryKey: [API_ENDPOINTS.SCHEDULE, CURRENT_USER_ID, "today"],
  });

  // Mock recent activity for now
  const recentActivity: Activity[] = [
    {
      id: "1",
      type: "completed",
      description: 'Completed "Two Sum" in 15 minutes',
      timestamp: "2 hours ago",
      difficulty: "Easy",
      problemTitle: "Two Sum",
    },
    {
      id: "2", 
      type: "revised",
      description: 'Revised "Maximum Subarray" - Improved time complexity',
      timestamp: "5 hours ago",
      difficulty: "Medium",
      problemTitle: "Maximum Subarray",
    },
    {
      id: "3",
      type: "pattern_noted",
      description: 'Added pattern notes for "Sliding Window" technique',
      timestamp: "1 day ago",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (statsLoading || scheduleLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Good morning, Coder!</h2>
              <p className="text-text-secondary">
                Day 15 of your 60-day journey • <span className="text-accent-blue">{currentDate}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-dark-surface px-4 py-2 rounded-lg flex items-center space-x-2">
                <i className="fas fa-fire text-accent-orange"></i>
                <span className="text-sm font-medium" data-testid="streak-count">
                  {stats?.streak || 15} day streak
                </span>
              </div>
              <div className="bg-dark-surface px-4 py-2 rounded-lg flex items-center space-x-2">
                <i className="fas fa-trophy text-accent-yellow"></i>
                <span className="text-sm font-medium" data-testid="cp-rating">1847 CP Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Today's Tasks */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-text-primary">
              <i className="fas fa-tasks text-accent-blue"></i>
              <span>Today's Tasks</span>
              <span className="ml-auto text-sm text-text-secondary">3 of 6 completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* New Problems */}
              <TaskCard
                title="New Problems"
                status="2/4 Done"
                statusColor="accent-green"
                tasks={[
                  { name: "Two Sum", completed: true },
                  { name: "Valid Parentheses", completed: true },
                  { name: "Merge Intervals", completed: false },
                  { name: "Binary Tree Inorder", completed: false },
                ]}
              />

              {/* Revision */}
              <TaskCard
                title="Revision"
                status="1/2 Done"
                statusColor="accent-purple"
                tasks={[
                  { name: "Longest Substring", completed: true },
                  { name: "Maximum Subarray", completed: false },
                ]}
              />

              {/* Flashcards */}
              <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm text-text-primary">Flashcards</h4>
                  <Badge className="bg-accent-cyan text-dark-primary">0/5 Done</Badge>
                </div>
                <div className="text-center py-4">
                  <i className="fas fa-cards-blank text-2xl text-text-muted mb-2"></i>
                  <p className="text-xs text-text-secondary">Ready to review</p>
                  <button 
                    className="mt-2 bg-accent-cyan text-dark-primary px-3 py-1 rounded text-xs font-medium hover:bg-accent-cyan/80 transition-colors"
                    data-testid="button-start-flashcards"
                  >
                    Start Review
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Problems Solved"
            value={stats?.completedProblems || 87}
            change="+5 this week"
            icon="fa-check"
            iconColor="accent-green"
            changeColor="accent-green"
          />
          <StatsCard
            title="Accuracy Rate"
            value={`${stats?.accuracy || 78}%`}
            change="+3% this week"
            icon="fa-target"
            iconColor="accent-blue"
            changeColor="accent-blue"
          />
          <StatsCard
            title="Weak Topics"
            value={stats?.weakTopics?.length || 3}
            change={stats?.weakTopics?.join(", ") || "DP, Graphs, Trees"}
            icon="fa-exclamation-triangle"
            iconColor="accent-orange"
            changeColor="text-secondary"
          />
          <StatsCard
            title="Interview Ready"
            value="65%"
            change="Good progress"
            icon="fa-graduation-cap"
            iconColor="accent-purple"
            changeColor="accent-purple"
          />
        </div>

        {/* Recent Activity */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-text-primary">
              <i className="fas fa-history text-accent-green"></i>
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskCard({ 
  title, 
  status, 
  statusColor, 
  tasks 
}: { 
  title: string;
  status: string;
  statusColor: string;
  tasks: { name: string; completed: boolean }[];
}) {
  return (
    <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm text-text-primary">{title}</h4>
        <Badge className={`bg-${statusColor} text-dark-primary`}>{status}</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-dark-primary rounded">
            <span className={`text-sm ${task.completed ? 'text-text-primary' : 'text-text-secondary'}`}>
              {task.name}
            </span>
            <i className={`fas ${task.completed ? 'fa-check text-accent-green' : 'fa-circle text-text-muted'}`}></i>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  icon,
  iconColor,
  changeColor,
}: {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  iconColor: string;
  changeColor: string;
}) {
  return (
    <Card className="bg-dark-secondary border-dark-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">{title}</p>
            <p className="text-2xl font-bold text-text-primary" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 bg-${iconColor}/20 rounded-lg flex items-center justify-center`}>
            <i className={`fas ${icon} text-${iconColor}`}></i>
          </div>
        </div>
        <p className={`text-xs text-${changeColor} mt-2`}>{change}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case "completed":
        return { icon: "fa-check", color: "accent-green" };
      case "revised":
        return { icon: "fa-redo", color: "accent-purple" };
      case "pattern_noted":
        return { icon: "fa-lightbulb", color: "accent-blue" };
      default:
        return { icon: "fa-info", color: "accent-blue" };
    }
  };

  const { icon, color } = getIconAndColor(activity.type);

  return (
    <div className="flex items-center space-x-4 p-3 bg-dark-surface rounded-lg">
      <div className={`w-8 h-8 bg-${color}/20 rounded-full flex items-center justify-center`}>
        <i className={`fas ${icon} text-${color} text-xs`}></i>
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-primary">{activity.description}</p>
        <p className="text-xs text-text-secondary">{activity.timestamp}</p>
      </div>
      {activity.difficulty && (
        <Badge className={`difficulty-${activity.difficulty.toLowerCase()}`}>
          {activity.difficulty}
        </Badge>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
