import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell, Shield, Globe, Smartphone, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface SettingsState {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    security: boolean;
  };
  privacy: {
    shareLocation: boolean;
    analytics: boolean;
  };
  preferences: {
    language: string;
    theme: string;
    currency: string;
  };
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      orderUpdates: true,
      promotions: false,
      security: true,
    },
    privacy: {
      shareLocation: true,
      analytics: false,
    },
    preferences: {
      language: "en",
      theme: "light",
      currency: "INR",
    },
  });

  const updateSetting = (category: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const notificationSettings = [
    {
      key: "orderUpdates",
      title: "Order Updates",
      description: "Get notified about your delivery status",
      icon: Bell,
    },
    {
      key: "promotions",
      title: "Promotions & Offers",
      description: "Receive promotional messages and special offers",
      icon: Bell,
    },
    {
      key: "security",
      title: "Security Alerts",
      description: "Important security and account notifications",
      icon: Shield,
    },
  ];

  const privacySettings = [
    {
      key: "shareLocation",
      title: "Share Location",
      description: "Allow location sharing for better delivery experience",
      icon: Globe,
    },
    {
      key: "analytics",
      title: "Usage Analytics",
      description: "Help improve the app by sharing usage data",
      icon: Smartphone,
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your app preferences</p>
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">{setting.title}</Label>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications[setting.key as keyof typeof settings.notifications]}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", setting.key, checked)
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacySettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">{setting.title}</Label>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.privacy[setting.key as keyof typeof settings.privacy]}
                  onCheckedChange={(checked) =>
                    updateSetting("privacy", setting.key, checked)
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>App Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Language</Label>
            <Select
              value={settings.preferences.language}
              onValueChange={(value) => updateSetting("preferences", "language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Theme</Label>
            <Select
              value={settings.preferences.theme}
              onValueChange={(value) => updateSetting("preferences", "theme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Currency</Label>
            <Select
              value={settings.preferences.currency}
              onValueChange={(value) => updateSetting("preferences", "currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Export My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Reset Settings
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-900">QuickDeliver</p>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400">Made with ❤️ in India</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}