import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Track from "@/pages/track";
import Account from "@/pages/account";
import Profile from "@/pages/profile";
import OrderHistory from "@/pages/order-history";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import BottomNavigation from "@/components/bottom-navigation";
import AppHeader from "@/components/app-header";

function Router() {
  return (
    <div className="mobile-container">
      {/* Status Bar */}
      <div className="status-bar flex justify-between items-center px-4 py-2 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
          <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
          <div className="w-6 h-3 border border-gray-600 rounded-sm">
            <div className="w-4 h-full bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </div>

      <AppHeader />
      
      <main className="pb-20 min-h-screen bg-gray-50">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/track" component={Track} />
          <Route path="/account" component={Account} />
          <Route path="/profile" component={Profile} />
          <Route path="/order-history" component={OrderHistory} />
          <Route path="/support" component={Support} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
