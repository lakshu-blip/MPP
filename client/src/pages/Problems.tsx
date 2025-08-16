import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProblemModal from "@/components/ProblemModal";
import CompletionModal from "@/components/CompletionModal";
import { API_ENDPOINTS, TOPIC_CATEGORIES, DIFFICULTY_FILTERS, TOPIC_FILTERS } from "@/lib/constants";
import type { ProblemWithProgress } from "@/lib/types";

export default function Problems() {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedProblem, setSelectedProblem] = useState<ProblemWithProgress | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [problemToComplete, setProblemToComplete] = useState<any>(null);

  const { data: problems, isLoading, error } = useQuery<ProblemWithProgress[]>({
    queryKey: [API_ENDPOINTS.PROBLEMS, { search, topic: topicFilter, difficulty: difficultyFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (topicFilter && topicFilter !== 'all') params.append('topic', topicFilter);
      if (difficultyFilter && difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);
      
      const response = await fetch(`${API_ENDPOINTS.PROBLEMS}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const handleProblemClick = (problem: ProblemWithProgress) => {
    setSelectedProblem(problem);
  };

  const handleMarkComplete = (problem: any) => {
    setProblemToComplete(problem);
    setCompletionModalOpen(true);
  };

  if (isLoading) {
    return <ProblemsSkeleton />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Problem Database</h2>
              <p className="text-text-secondary">350 carefully curated coding problems</p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                <Input
                  type="text"
                  placeholder="Search problems..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-dark-surface border-dark-border pl-10 pr-4 py-2 text-sm focus:border-accent-blue"
                  data-testid="input-search-problems"
                />
              </div>
              
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="bg-dark-surface border-dark-border w-40" data-testid="select-topic-filter">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="bg-dark-surface border-dark-border w-40" data-testid="select-difficulty-filter">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Topic Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {TOPIC_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="bg-dark-secondary p-4 rounded-lg text-center hover:bg-dark-surface transition-colors cursor-pointer"
              onClick={() => setTopicFilter(category.name)}
              data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <i className={`fas ${category.icon} text-${category.color} text-xl mb-2`}></i>
              <h4 className="text-sm font-medium text-text-primary">{category.name}</h4>
              <p className="text-xs text-text-secondary">{category.count} problems</p>
            </div>
          ))}
        </div>

        {/* Problems List */}
        <Card className="bg-dark-secondary border-dark-border overflow-hidden">
          <CardHeader className="border-b border-dark-border">
            <CardTitle className="text-text-primary">
              All Problems {problems && Array.isArray(problems) && `(${problems.length})`}
            </CardTitle>
            <p className="text-sm text-text-secondary mt-2">
              Your complete problem library - browse, search, and practice at your own pace
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-border">
              {!problems || !Array.isArray(problems) ? (
                <div className="p-8 text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-accent-orange mb-4"></i>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Unable to load problems</h3>
                  <p className="text-text-secondary">
                    There seems to be an issue loading the problems. Please refresh the page.
                  </p>
                </div>
              ) : problems.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="fas fa-search text-4xl text-text-muted mb-4"></i>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No problems found</h3>
                  <p className="text-text-secondary">
                    Try adjusting your search criteria or import problems to get started.
                  </p>
                </div>
              ) : (
                problems.map((problem) => (
                  <ProblemRow 
                    key={problem.id} 
                    problem={problem} 
                    onClick={() => handleProblemClick(problem)} 
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Modal */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          open={!!selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
      
      {problemToComplete && (
        <CompletionModal
          problem={problemToComplete}
          open={completionModalOpen}
          onClose={() => {
            setCompletionModalOpen(false);
            setProblemToComplete(null);
          }}
        />
      )}
    </div>
  );
}

function ProblemRow({ problem, onClick }: { problem: ProblemWithProgress; onClick: () => void }) {
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  
  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletionModalOpen(true);
  };
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green';
      case 'in_progress':
        return 'bg-accent-blue';
      case 'revision_needed':
        return 'bg-accent-purple';
      default:
        return 'bg-text-muted';
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  const getSuccessText = (problem: ProblemWithProgress) => {
    if (problem.status === 'completed' && problem.successfulAttempts && problem.attempts) {
      const rate = Math.round((problem.successfulAttempts / problem.attempts) * 100);
      return `${rate}% Success`;
    }
    if (problem.status === 'in_progress') {
      return 'In Progress';
    }
    return 'Not Started';
  };

  return (
    <>
      <div
        className="p-4 hover:bg-dark-surface transition-colors cursor-pointer"
        onClick={onClick}
        data-testid={`problem-row-${problem.id}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(problem.status)}`}></div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary">{problem.title}</h4>
              <div className="flex items-center space-x-4 mt-1">
                <Badge className={getDifficultyClass(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <span className="text-xs text-text-secondary">
                  {problem.topics?.join(", ")}
                </span>
                <span className="text-xs text-text-secondary">
                  {problem.companies?.join(", ")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-xs ${
                problem.status === 'completed' ? 'text-accent-green' : 
                problem.status === 'in_progress' ? 'text-accent-blue' : 
                'text-text-muted'
              }`}>
                {getSuccessText(problem)}
              </p>
              <p className="text-xs text-text-secondary">
                {problem.attempts || 0} attempts
              </p>
            </div>
            {problem.status !== 'completed' && (
              <Button
                size="sm"
                onClick={handleMarkComplete}
                className="bg-accent-green hover:bg-accent-green/80 text-dark-primary text-xs px-3 py-1"
                data-testid={`complete-${problem.id}`}
              >
                ✓ Complete
              </Button>
            )}
            <i className="fas fa-chevron-right text-text-muted"></i>
          </div>
        </div>
      </div>
      
      {completionModalOpen && (
        <CompletionModal
          problem={problem}
          open={completionModalOpen}
          onClose={() => setCompletionModalOpen(false)}
        />
      )}
    </>
  );
}

function ProblemsSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader className="border-b border-dark-border">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-border">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
