import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-chart-pie", emoji: "📊" },
  { name: "Problems", href: "/problems", icon: "fas fa-code", emoji: "💻" },
  { name: "Schedule", href: "/schedule", icon: "fas fa-calendar-alt", emoji: "📅" },
  { name: "CodeChef", href: "/codechef", icon: "fas fa-trophy", emoji: "🏆" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-dark-secondary border-r border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <h1 className="text-xl font-bold text-text-primary">
          🎯 Master Placement Platform
        </h1>
        <p className="text-xs text-text-secondary mt-1">Your path to FAANG success</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-blue text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-dark-surface"
                  )}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className="text-xs text-text-secondary">
          <div className="flex items-center justify-between mb-2">
            <span>Progress Tracker</span>
            <span className="text-accent-green">87%</span>
          </div>
          <div className="w-full bg-dark-primary rounded-full h-1.5">
            <div className="bg-accent-green h-1.5 rounded-full" style={{ width: "87%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}