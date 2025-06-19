import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Route, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home", id: "home" },
    { path: "/track", icon: Route, label: "Track", id: "track" },
    { path: "/account", icon: User, label: "Account", id: "account" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center py-2 px-4 touch-target mobile-button ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
