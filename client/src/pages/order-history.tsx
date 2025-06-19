import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Filter, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "accepted":
      return "bg-blue-100 text-blue-800";
    case "pickup":
      return "bg-orange-100 text-orange-800";
    case "in_transit":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/customers/1/orders"],
  });

  const orders = data?.orders || [];

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && !["delivered", "cancelled"].includes(order.status)) ||
      (activeTab === "completed" && order.status === "delivered") ||
      (activeTab === "cancelled" && order.status === "cancelled");

    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: orders.length,
      active: orders.filter((o: any) => !["delivered", "cancelled"].includes(o.status)).length,
      completed: orders.filter((o: any) => o.status === "delivered").length,
      cancelled: orders.filter((o: any) => o.status === "cancelled").length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/account">
          <Button variant="ghost" size="icon" className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">View all your past deliveries</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by order ID or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" className="touch-target">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs">
            Active ({tabCounts.active})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Done ({tabCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">
            Cancelled ({tabCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Failed to load order history</p>
                <p className="text-sm text-red-500 mt-1">Please try again later</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  {searchTerm ? "No orders found" : "No orders yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "Your order history will appear here"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => (
                <Card key={order.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-semibold text-gray-900">
                            #QD{order.id.toString().padStart(7, '0')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {/* Order Route */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600 truncate">{order.pickupAddress}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Drop-off</p>
                          <p className="text-sm text-gray-600 truncate">{order.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-xs text-gray-500">Package</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {order.packageSize}
                          </p>
                        </div>
                        {order.distance && (
                          <div>
                            <p className="text-xs text-gray-500">Distance</p>
                            <p className="text-sm font-medium text-gray-900">
                              {parseFloat(order.distance).toFixed(1)} km
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{order.actualPrice || order.estimatedPrice}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Partner Info */}
                    {order.deliveryPartner && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {order.deliveryPartner.fullName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Delivered by {order.deliveryPartner.fullName || 'Delivery Partner'}
                            </p>
                            {order.deliveryPartner.partnerDetails?.rating && (
                              <p className="text-xs text-gray-500">
                                Rating: {order.deliveryPartner.partnerDetails.rating} ⭐
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
