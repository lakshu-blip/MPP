import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PageExplanation() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary">Platform Guide</h2>
          <p className="text-text-secondary">Understanding the Problems vs Schedule approach</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Overview */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-info-circle mr-3 text-accent-blue"></i>
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary leading-relaxed">
              Your Master Placement Platform uses a <strong className="text-text-primary">dual-page system</strong> designed 
              for optimal interview preparation. This approach separates exploration from structured learning to maximize retention 
              and prevent overwhelm.
            </p>
          </CardContent>
        </Card>

        {/* Problems Page */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-database mr-3 text-accent-green"></i>
              Problems Page: Your Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Purpose</h4>
                <ul className="text-text-secondary space-y-1">
                  <li>• Browse all 335+ problems from your BYTS sheet</li>
                  <li>• Search and filter by topics or difficulty</li>
                  <li>• Quick reference and exploration</li>
                  <li>• View detailed problem information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Best For</h4>
                <ul className="text-text-secondary space-y-1">
                  <li>• Looking up specific problems</li>
                  <li>• Reviewing patterns you've learned</li>
                  <li>• Exploring new topics</li>
                  <li>• Weekend practice sessions</li>
                </ul>
              </div>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
              <div className="flex items-center mb-2">
                <Badge variant="secondary" className="bg-accent-green/20 text-accent-green">
                  Self-Directed Learning
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">
                Think of this as your coding problem library. Great for when you want to explore 
                or practice specific topics at your own pace.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Page */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-calendar-alt mr-3 text-accent-blue"></i>
              Schedule Page: Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Purpose</h4>
                <ul className="text-text-secondary space-y-1">
                  <li>• Follow a curated 60-day learning plan</li>
                  <li>• Optimal problem sequence for skill building</li>
                  <li>• Spaced repetition for better retention</li>
                  <li>• Daily focused practice sessions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Best For</h4>
                <ul className="text-text-secondary space-y-1">
                  <li>• Daily structured preparation</li>
                  <li>• Following a proven learning sequence</li>
                  <li>• Building consistent study habits</li>
                  <li>• Interview preparation timeline</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-accent-blue/20 text-accent-blue">
                    Phase 1: Days 1-20
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  Foundation building with core patterns from your BYTS sheet in optimal learning order.
                </p>
              </div>
              
              <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-accent-purple/20 text-accent-purple">
                    Phase 2: Days 21-40
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  Advanced patterns (DP, Graphs, Trees) with revision of earlier concepts.
                </p>
              </div>
              
              <div className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-accent-orange/20 text-accent-orange">
                    Phase 3: Days 41-60
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  Mixed difficulty practice simulating real interview scenarios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile & Notifications */}
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-mobile-alt mr-3 text-accent-cyan"></i>
              Mobile & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Mobile Access</h4>
                <p className="text-text-secondary text-sm">
                  Your platform works perfectly on phones through the Replit Mobile App. 
                  You can practice, review schedules, and track progress on the go.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Smart Notifications</h4>
                <p className="text-text-secondary text-sm">
                  Replit AI Assistant can send you push notifications for daily practice 
                  reminders and progress updates to keep you consistent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Recommendation */}
        <Card className="bg-gradient-to-r from-accent-blue/10 to-accent-green/10 border-accent-blue/20">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center">
              <i className="fas fa-lightbulb mr-3 text-accent-yellow"></i>
              Recommended Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Start with Schedule</h4>
                  <p className="text-text-secondary text-sm">Follow your daily schedule for structured learning and optimal progress.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Use Problems for Deep Dives</h4>
                  <p className="text-text-secondary text-sm">Explore the Problems page when you want to practice specific patterns or need extra work on weak areas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-text-primary">Track Progress</h4>
                  <p className="text-text-secondary text-sm">Dashboard shows your overall progress from both pages, helping you stay motivated.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}