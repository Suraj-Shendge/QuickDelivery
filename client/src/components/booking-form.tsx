import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Package, Truck, User, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";

const bookingSchema = z.object({
  pickupAddress: z.string().min(5, "Pickup address is required"),
  pickupPersonName: z.string().min(2, "Pickup person name is required"),
  pickupPersonPhone: z.string().min(10, "Pickup person phone is required"),
  dropoffAddress: z.string().min(5, "Delivery address is required"),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientPhone: z.string().min(10, "Recipient phone is required"),
  packageSize: z.enum(["small", "medium", "large"]),
  specialInstructions: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const packageTypes = [
  {
    id: "small",
    label: "Small",
    description: "Up to 2kg",
    icon: Package,
  },
  {
    id: "medium",
    label: "Medium", 
    description: "Up to 10kg",
    icon: Package,
  },
  {
    id: "large",
    label: "Large",
    description: "Up to 25kg",
    icon: Truck,
  },
];

export default function BookingForm() {
  const [selectedPackage, setSelectedPackage] = useState<string>("medium");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const { toast } = useToast();
  const { getCurrentLocation, loading: locationLoading } = useGeolocation();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupAddress: "",
      pickupPersonName: "",
      pickupPersonPhone: "",
      dropoffAddress: "",
      recipientName: "",
      recipientPhone: "",
      packageSize: "medium",
      specialInstructions: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/orders", {
        ...data,
        customerId: 1, // Demo customer ID
        estimatedPrice: estimatedPrice?.toString() || "100",
        distance: "5.0", // Demo distance
        status: "pending",
        deliveryPartnerId: null,
        actualPrice: null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful!",
        description: "Your delivery has been booked. You'll be notified when a delivery partner accepts your order.",
      });
      form.reset();
      setEstimatedPrice(null);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your delivery. Please try again.",
        variant: "destructive",
      });
    },
  });

  const priceMutation = useMutation({
    mutationFn: async ({ packageSize }: { packageSize: string }) => {
      const response = await apiRequest("POST", "/api/calculate-price", {
        pickupLat: "19.0760",
        pickupLng: "72.8777",
        dropoffLat: "19.0896",
        dropoffLng: "72.8656",
        packageSize,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setEstimatedPrice(data.estimatedPrice);
    },
  });

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    form.setValue("packageSize", packageId as "small" | "medium" | "large");
    priceMutation.mutate({ packageSize: packageId });
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await getCurrentLocation();
      // In a real app, you'd use reverse geocoding to get the address
      form.setValue("pickupAddress", `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
      toast({
        title: "Location Set",
        description: "Current location set as pickup address",
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get current location. Please enter address manually.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  // Calculate price when addresses change
  useEffect(() => {
    const { pickupAddress, dropoffAddress } = form.getValues();
    if (pickupAddress && dropoffAddress && selectedPackage) {
      priceMutation.mutate({ packageSize: selectedPackage });
    }
  }, [form.watch("pickupAddress"), form.watch("dropoffAddress")]);

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Book a Delivery</h2>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Pickup Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Pickup Details</h3>
            </div>
            
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2">Pickup Address</Label>
              <div className="relative">
                <Input
                  {...form.register("pickupAddress")}
                  placeholder="Enter pickup address"
                  className="pr-12 h-12 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                >
                  <MapPin className="h-4 w-4 text-primary" />
                </Button>
              </div>
              {form.formState.errors.pickupAddress && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.pickupAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Contact Person Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...form.register("pickupPersonName")}
                    placeholder="Full name"
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {form.formState.errors.pickupPersonName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.pickupPersonName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...form.register("pickupPersonPhone")}
                    placeholder="+91 98765 43210"
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {form.formState.errors.pickupPersonPhone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.pickupPersonPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Delivery Details</h3>
            </div>
            
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2">Delivery Address</Label>
              <Input
                {...form.register("dropoffAddress")}
                placeholder="Enter delivery address"
                className="h-12 text-base"
              />
              {form.formState.errors.dropoffAddress && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.dropoffAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Recipient Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...form.register("recipientName")}
                    placeholder="Recipient name"
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {form.formState.errors.recipientName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.recipientName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Recipient Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...form.register("recipientPhone")}
                    placeholder="+91 98765 43210"
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {form.formState.errors.recipientPhone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.recipientPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Package Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">Package Size</Label>
            <div className="grid grid-cols-3 gap-3">
              {packageTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedPackage === type.id;
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handlePackageSelect(type.id)}
                    className={`package-type-btn flex flex-col items-center p-4 border-2 rounded-xl transition-all touch-target ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                    <span className="text-xs opacity-70">{type.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</Label>
            <Input
              {...form.register("specialInstructions")}
              placeholder="e.g., Fragile items, Ring doorbell, Call before delivery"
              className="h-12 text-base"
            />
          </div>

          {/* Price Display */}
          {estimatedPrice && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Price</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">₹{estimatedPrice}</span>
                  <p className="text-xs text-gray-500">Distance: 8.5 km</p>
                </div>
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold mobile-button"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? "Booking..." : "Book Delivery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
