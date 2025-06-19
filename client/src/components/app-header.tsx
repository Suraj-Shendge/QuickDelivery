import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.05l.5 2.5a2 2 0 002 1.5h8.9a2 2 0 002-1.5L18 8h-1a1 1 0 001-1V6a1 1 0 00-1-1H3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">QuickDeliver</h1>
            <p className="text-xs text-gray-500">Mumbai, India</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
