import BookingForm from "@/components/booking-form";
import ActiveOrders from "@/components/active-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="space-y-4 pb-4">
      {/* Hero Section */}
      <section className="px-4 pt-2">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Fast & Reliable Delivery</h2>
          <p className="text-primary-foreground/90 mb-4">Send anything, anywhere in the city</p>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold">30 min</div>
              <div className="text-xs opacity-80">Avg pickup</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">₹50</div>
              <div className="text-xs opacity-80">Starting at</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">24/7</div>
              <div className="text-xs opacity-80">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <div className="px-4">
        <BookingForm />
      </div>

      {/* Active Orders */}
      <ActiveOrders />

      {/* Service Features */}
      <section className="px-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Why Choose QuickDeliver?</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Lightning Fast</h4>
              <p className="text-sm text-gray-500">Same day delivery guaranteed</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">100% Safe</h4>
              <p className="text-sm text-gray-500">Insured & tracked delivery</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Real-time</h4>
              <p className="text-sm text-gray-500">Live tracking updates</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Fair Pricing</h4>
              <p className="text-sm text-gray-500">Transparent costs</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
