import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Sidebar() {
  const [location] = useLocation();
  const [overallProgress] = useState(25); // TODO: Get from API

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fa-home", count: null },
    { path: "/problems", label: "Problems", icon: "fa-tasks", count: 340 },
    { path: "/schedule", label: "Schedule", icon: "fa-calendar-alt", count: null },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="w-64 bg-dark-secondary border-r border-dark-border flex-shrink-0 flex flex-col" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-text-primary">MPP</h1>
        </div>
        
        {/* Navigation Items */}
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive(item.path)
                      ? "bg-accent-blue/20 text-accent-blue"
                      : "hover:bg-dark-surface text-text-secondary hover:text-text-primary"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <i className={`fas ${item.icon} w-5`}></i>
                  <span className="font-medium">{item.label}</span>
                  {item.count && (
                    <span className="ml-auto bg-dark-surface px-2 py-1 rounded text-xs">
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Summary */}
      <div className="px-6 pb-6 mt-auto">
        <div className="bg-dark-surface p-4 rounded-lg">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Overall Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Day 15/60</span>
            <span className="text-xs text-accent-green">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>
    </nav>
  );
}
