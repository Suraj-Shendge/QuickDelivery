import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  History, 
  MessageCircle, 
  Settings, 
  ChevronRight,
  Bell,
  Shield,
  CreditCard,
  MapPin
} from "lucide-react";

const accountItems = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your personal information",
    href: "/profile",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: History,
    title: "Order History",
    description: "View all your past deliveries",
    href: "/order-history", 
    color: "text-green-600 bg-green-100",
  },
  {
    icon: MessageCircle,
    title: "Help & Support",
    description: "Get help and contact us",
    href: "/support",
    color: "text-purple-600 bg-purple-100",
  },
  {
    icon: Settings,
    title: "Settings",
    description: "App preferences and notifications",
    href: "/settings",
    color: "text-gray-600 bg-gray-100",
  },
];

const quickActions = [
  {
    icon: Bell,
    title: "Notifications",
    count: 3,
  },
  {
    icon: Shield,
    title: "Safety",
    count: null,
  },
  {
    icon: CreditCard,
    title: "Payments",
    count: null,
  },
  {
    icon: MapPin,
    title: "Addresses",
    count: 2,
  },
];

export default function Account() {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users/1"],
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/users/1/stats"],
  });

  const user = userData?.user;
  const stats = statsData?.stats;

  return (
    <div className="p-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          {userLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="w-5 h-5" />
            </div>
          ) : (
            <Link href="/profile">
              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{user?.fullName || 'User'}</h2>
                  <p className="text-gray-600">{user?.phoneNumber || 'No phone number'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'No email address'}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Account Overview</h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-2" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-blue-700">Total Orders</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</p>
                <p className="text-sm text-green-700">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">₹{Math.round(stats?.totalSpent || 0)}</p>
                <p className="text-sm text-yellow-700">Total Spent</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats?.averageRating || 0}</p>
                <p className="text-sm text-purple-700">Rating</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="relative inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    {action.count && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {action.count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Menu Items */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Account Options</h2>
        <div className="space-y-2">
          {accountItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* App Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">QuickDeliver v1.0.0</p>
          <p className="text-xs text-gray-500 mt-1">Fast, reliable, and secure delivery service</p>
        </CardContent>
      </Card>
    </div>
  );
}
