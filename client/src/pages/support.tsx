import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search,
  HelpCircle,
  Send,
  Clock,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const faqData = [
  {
    question: "How do I track my order?",
    answer: "You can track your order in real-time by going to the 'Track' section in the app or by entering your order ID in the search field. You'll receive live updates about your delivery status.",
  },
  {
    question: "What items can I send?",
    answer: "You can send most items including documents, packages, food, and personal belongings. However, we don't allow hazardous materials, illegal items, or extremely fragile items without proper packaging.",
  },
  {
    question: "How is the delivery price calculated?",
    answer: "Pricing is based on distance, package size, and current demand. Small packages start from ₹50, with additional charges based on distance (₹12/km) and size multipliers for medium (1.5x) and large (2x) packages.",
  },
  {
    question: "What if my package is damaged or lost?",
    answer: "We take full responsibility for packages in our care. If your package is damaged or lost, please contact support immediately. We provide insurance coverage up to ₹10,000 for all deliveries.",
  },
  {
    question: "Can I schedule a delivery for later?",
    answer: "Currently, we only offer same-day delivery services. However, you can book a delivery and specify special instructions for timing preferences within the same day.",
  },
  {
    question: "How do I become a delivery partner?",
    answer: "To become a delivery partner, you need a valid driving license, vehicle registration, and smartphone. Contact our support team to start the application process.",
  },
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    action: "Start Chat",
    color: "bg-blue-100 text-blue-600",
    available: true,
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+91 1800-123-4567 (Toll Free)",
    action: "Call Now",
    color: "bg-green-100 text-green-600",
    available: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@quickdeliver.com",
    action: "Send Email",
    color: "bg-purple-100 text-purple-600",
    available: true,
  },
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "normal",
  });
  const { toast } = useToast();

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to support
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setContactForm({ subject: "", message: "", priority: "normal" });
  };

  const startLiveChat = () => {
    toast({
      title: "Starting Live Chat",
      description: "Connecting you with a support agent...",
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600">Get help and contact us</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${method.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={method.title === "Live Chat" ? startLiveChat : undefined}
                    className="touch-target"
                  >
                    {method.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Support Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          {/* FAQ Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No FAQs found matching your search</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="What can we help you with?"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={contactForm.priority}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Describe your issue or question in detail..."
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Response Time Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Response Time</p>
                  <p className="text-sm text-blue-700">
                    We typically respond within 2-4 hours during business hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Support Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Support Status: Online</p>
              <p className="text-sm text-gray-600">
                Our support team is available 24/7 to help you
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
