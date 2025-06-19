import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle } from "lucide-react";
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Finding Partner";
    case "accepted":
      return "Partner Assigned";
    case "pickup":
      return "On the way to pickup";
    case "in_transit":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const getProgressPercentage = (status: string) => {
  switch (status) {
    case "pending":
      return 25;
    case "accepted":
      return 40;
    case "pickup":
      return 65;
    case "in_transit":
      return 85;
    case "delivered":
      return 100;
    default:
      return 0;
  }
};

export default function ActiveOrders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/customers/1/orders/active"],
  });

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Active Orders</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border border-gray-100">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32 mb-4" />
                <Skeleton className="h-2 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Active Orders</h3>
        <Card className="border border-red-100 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Failed to load active orders. Please try again.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <section className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Active Orders</h3>
        <Card className="border border-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No active orders</p>
            <p className="text-sm text-gray-400 mt-1">Your active deliveries will appear here</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Active Orders</h3>
      
      <div className="space-y-3">
        {orders.map((order: any) => (
          <Card key={order.id} className="border border-gray-100">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">#QD{order.id.toString().padStart(7, '0')}</p>
                  <p className="text-sm text-gray-500">{getStatusLabel(order.status)}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Placed</span>
                  <span>Pickup</span>
                  <span>Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-secondary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(order.status)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Delivery Partner Info */}
              {order.deliveryPartner && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {order.deliveryPartner.fullName?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.deliveryPartner.fullName || 'Delivery Partner'}
                      </p>
                      <p className="text-sm text-gray-500">Delivery Partner</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="touch-target">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="touch-target">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="text-gray-900 text-right flex-1 ml-2 truncate">
                    {order.pickupAddress}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">To:</span>
                  <span className="text-gray-900 text-right flex-1 ml-2 truncate">
                    {order.dropoffAddress}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{order.estimatedPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
