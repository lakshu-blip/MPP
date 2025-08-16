import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProgressTracking() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary">Progress Tracking System</h2>
          <p className="text-text-secondary">How we track and optimize your learning journey</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Overview */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-chart-line mr-3 text-accent-blue"></i>
              Multi-Dimensional Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed mb-4">
              Your platform uses advanced progress tracking across 7 different dimensions to ensure 
              comprehensive learning and retention. Every action you take is recorded and analyzed 
              to optimize your study plan.
            </p>
          </CardContent>
        </Card>

        {/* Individual Problem Progress */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-tasks mr-3 text-accent-green"></i>
              1. Individual Problem Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-3">What Gets Tracked:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• Status: Not Started → In Progress → Completed</li>
                  <li>• Number of attempts on each problem</li>
                  <li>• Successful vs failed attempts</li>
                  <li>• Time spent solving each problem</li>
                  <li>• Your solution code and approach</li>
                  <li>• Personal notes and insights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Smart Features:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• Automatic revision scheduling based on performance</li>
                  <li>• Difficulty adjustment suggestions</li>
                  <li>• Pattern recognition tracking</li>
                  <li>• Weak area identification</li>
                </ul>
              </div>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Two Sum</span>
                <Badge className="bg-accent-green/20 text-accent-green">Completed</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>3 attempts • 15 minutes</span>
                <span>Next revision: 5 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spaced Repetition System */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-repeat mr-3 text-accent-purple"></i>
              2. Spaced Repetition System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary">
              Problems are automatically scheduled for revision at optimal intervals: 
              1 day → 3 days → 5 days → 7 days → 14 days → 30 days
            </p>
            <div className="space-y-3">
              {[
                { interval: "1 day", description: "Initial reinforcement", color: "accent-blue" },
                { interval: "3 days", description: "Short-term retention check", color: "accent-green" },
                { interval: "7 days", description: "Medium-term memory test", color: "accent-purple" },
                { interval: "30 days", description: "Long-term mastery verification", color: "accent-orange" }
              ].map((phase, index) => (
                <div key={index} className="flex items-center space-x-4 bg-dark-surface p-3 rounded-lg">
                  <div className={`w-3 h-3 bg-${phase.color} rounded-full`}></div>
                  <div>
                    <span className="font-medium text-text-primary">{phase.interval}</span>
                    <span className="text-text-secondary ml-2">- {phase.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mistake Analysis */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-bug mr-3 text-accent-orange"></i>
              3. Intelligent Mistake Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Mistake Categories:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• <strong>Logical:</strong> Algorithm approach errors</li>
                  <li>• <strong>Syntax:</strong> Code implementation issues</li>
                  <li>• <strong>Pattern:</strong> Missed common patterns</li>
                  <li>• <strong>Edge Cases:</strong> Boundary condition errors</li>
                  <li>• <strong>Optimization:</strong> Time/space complexity issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Adaptive Response:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• Problems with mistakes get extra revision</li>
                  <li>• Similar problems added to schedule</li>
                  <li>• Pattern-specific flashcards created</li>
                  <li>• Weak topics get more focus time</li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-r from-accent-orange/10 to-accent-red/10 p-4 rounded-lg border border-accent-orange/20">
              <h4 className="font-medium text-text-primary mb-2">Smart Recovery System</h4>
              <p className="text-sm text-text-secondary">
                When you make mistakes, the system doesn't just mark them as wrong. It analyzes the pattern, 
                creates targeted practice sessions, and schedules similar problems until you master the concept.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily & Weekly Statistics */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-calendar-check mr-3 text-accent-cyan"></i>
              4. Daily Task & Schedule Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-dark-surface p-4 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">Daily Tasks</h4>
                <p className="text-sm text-text-secondary">Track completion of scheduled problems, revisions, and flashcard reviews</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">Time Tracking</h4>
                <p className="text-sm text-text-secondary">Automatic logging of time spent on each problem and topic</p>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">Streak Counter</h4>
                <p className="text-sm text-text-secondary">Daily practice streaks to maintain consistency</p>
              </div>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary">Today's Progress</h4>
                <span className="text-accent-green font-medium">75% Complete</span>
              </div>
              <Progress value={75} className="mb-2" />
              <div className="flex justify-between text-sm text-text-secondary">
                <span>3 of 4 problems solved</span>
                <span>2h 30m study time</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern & Topic Mastery */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-puzzle-piece mr-3 text-accent-pink"></i>
              5. Pattern & Topic Mastery Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary">
              Track your understanding of key programming patterns and data structure topics:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { pattern: "Two Pointers", progress: 85, problems: 12 },
                { pattern: "Sliding Window", progress: 92, problems: 8 },
                { pattern: "Dynamic Programming", progress: 67, problems: 23 },
                { pattern: "Binary Search", progress: 78, problems: 15 }
              ].map((item, index) => (
                <div key={index} className="bg-dark-surface p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{item.pattern}</h4>
                    <span className="text-sm text-text-secondary">{item.problems} problems</span>
                  </div>
                  <Progress value={item.progress} className="mb-2" />
                  <span className="text-sm text-accent-blue">{item.progress}% mastery</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flashcard System */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-layer-group mr-3 text-accent-yellow"></i>
              6. Flashcard Knowledge System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Automatic Generation:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• Key concepts from solved problems</li>
                  <li>• Algorithm time/space complexities</li>
                  <li>• Common pitfalls and edge cases</li>
                  <li>• Pattern recognition questions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Review Tracking:</h4>
                <ul className="text-text-secondary space-y-2">
                  <li>• Review frequency and success rates</li>
                  <li>• Difficult cards get more frequent review</li>
                  <li>• Mastered concepts reviewed less often</li>
                  <li>• Custom cards for personal weak spots</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-analytics mr-3 text-accent-purple"></i>
              7. Advanced Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-dark-surface p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent-green mb-1">340</div>
                <div className="text-sm text-text-secondary">Total Problems</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent-blue mb-1">127</div>
                <div className="text-sm text-text-secondary">Completed</div>
              </div>
              <div className="bg-dark-surface p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent-orange mb-1">37%</div>
                <div className="text-sm text-text-secondary">Progress</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary">Advanced Metrics:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Average solve time:</span>
                    <span className="text-text-primary">23 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">First-attempt success rate:</span>
                    <span className="text-text-primary">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Revision efficiency:</span>
                    <span className="text-text-primary">91%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Study streak:</span>
                    <span className="text-text-primary">15 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Weekly target:</span>
                    <span className="text-text-primary">28/30 problems</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Estimated completion:</span>
                    <span className="text-text-primary">42 days</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy & Control */}
        <Card className="bg-gradient-to-r from-accent-blue/10 to-accent-green/10 border-accent-blue/20">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-shield-alt mr-3 text-accent-cyan"></i>
              Your Data, Your Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Complete Transparency</h4>
                  <p className="text-text-secondary text-sm">All tracking data is visible to you through the dashboard and detailed progress reports.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Local Storage</h4>
                  <p className="text-text-secondary text-sm">Your progress data is stored securely in your database, under your complete control.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Export Capability</h4>
                  <p className="text-text-secondary text-sm">Export your progress data anytime for backup or analysis in external tools.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}