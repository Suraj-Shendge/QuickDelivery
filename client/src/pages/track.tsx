import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Package, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Track() {
  const [orderId, setOrderId] = useState("");
  const [searchOrderId, setSearchOrderId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/customers/1/orders/active"],
    enabled: true,
  });

  const handleSearch = () => {
    if (orderId.trim()) {
      setSearchOrderId(orderId.trim());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "accepted":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "pickup":
        return <MapPin className="w-5 h-5 text-orange-600" />;
      case "in_transit":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "delivered":
        return <Package className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { id: "pending", label: "Order Placed", completed: false },
      { id: "accepted", label: "Partner Assigned", completed: false },
      { id: "pickup", label: "Package Picked", completed: false },
      { id: "in_transit", label: "In Transit", completed: false },
      { id: "delivered", label: "Delivered", completed: false },
    ];

    const statusOrder = ["pending", "accepted", "pickup", "in_transit", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Orders</h1>
        <p className="text-gray-600">Monitor your delivery status in real-time</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Track by Order ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter order ID (e.g., QD2401234)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="touch-target">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Failed to load orders</p>
              <p className="text-sm text-red-500 mt-1">Please try again later</p>
            </CardContent>
          </Card>
        ) : data?.orders?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No active orders</p>
              <p className="text-sm text-gray-400">Book a delivery to start tracking</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.orders?.map((order: any) => {
              const steps = getStatusSteps(order.status);
              
              return (
                <Card key={order.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-semibold text-gray-900">
                            #QD{order.id.toString().padStart(7, '0')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        {steps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`flex flex-col items-center flex-1 ${
                              index < steps.length - 1 ? 'border-r border-gray-200' : ''
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                                step.completed
                                  ? 'bg-primary text-white'
                                  : step.active
                                  ? 'bg-primary/20 text-primary border-2 border-primary'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {step.completed ? '✓' : index + 1}
                            </div>
                            <span
                              className={`text-xs text-center ${
                                step.completed || step.active
                                  ? 'text-gray-900 font-medium'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">{order.pickupAddress}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Drop-off</p>
                          <p className="text-sm text-gray-600">{order.dropoffAddress}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="text-sm text-gray-600">Package Size</p>
                          <p className="font-medium text-gray-900 capitalize">{order.packageSize}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-semibold text-gray-900">₹{order.estimatedPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Partner Info */}
                    {order.deliveryPartner && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {order.deliveryPartner.fullName?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.deliveryPartner.fullName || 'Delivery Partner'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.deliveryPartner.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
