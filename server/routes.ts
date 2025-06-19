import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.password;
      delete updates.id;
      delete updates.createdAt;
      
      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Calculate estimated price based on distance and package size
      const basePrice = 50; // Base price in INR
      const distance = parseFloat(orderData.distance || "5");
      const packageMultiplier = {
        small: 1.0,
        medium: 1.5,
        large: 2.0,
      }[orderData.packageSize] || 1.0;
      
      const estimatedPrice = Math.round(basePrice + (distance * 12) * packageMultiplier);
      
      const order = await storage.createOrder({
        ...orderData,
        estimatedPrice: estimatedPrice.toString(),
      });
      
      res.json({ order });
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error });
    }
  });

  app.get("/api/customers/:customerId/orders", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await storage.getOrdersByCustomer(customerId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error });
    }
  });

  app.get("/api/customers/:customerId/orders/active", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await storage.getActiveOrdersByCustomer(customerId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active orders", error });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status, deliveryPartnerId } = req.body;
      
      const order = await storage.updateOrderStatus(orderId, status, deliveryPartnerId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status", error });
    }
  });

  // Price calculation endpoint
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const { pickupLat, pickupLng, dropoffLat, dropoffLng, packageSize } = req.body;
      
      // Simple distance calculation (in a real app, use Google Maps Distance Matrix API)
      const distance = Math.sqrt(
        Math.pow(parseFloat(dropoffLat) - parseFloat(pickupLat), 2) +
        Math.pow(parseFloat(dropoffLng) - parseFloat(pickupLng), 2)
      ) * 111; // Rough conversion to km
      
      const basePrice = 50;
      const packageMultiplier = {
        small: 1.0,
        medium: 1.5,
        large: 2.0,
      }[packageSize] || 1.0;
      
      const estimatedPrice = Math.round(basePrice + (distance * 12) * packageMultiplier);
      
      res.json({ 
        estimatedPrice,
        distance: Math.round(distance * 100) / 100,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to calculate price", error });
    }
  });

  // User statistics
  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const orders = await storage.getOrdersByCustomer(userId);
      
      const completedOrders = orders.filter(order => order.status === 'delivered');
      const totalSpent = completedOrders.reduce((sum, order) => 
        sum + parseFloat(order.actualPrice || order.estimatedPrice || '0'), 0);
      
      const stats = {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalSpent: totalSpent,
        averageRating: 4.8, // Mock rating for now
        memberSince: new Date('2024-01-01').toISOString()
      };
      
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats", error });
    }
  });

  // Delivery partner routes
  app.get("/api/delivery-partners/available", async (req, res) => {
    try {
      const partners = await storage.getAvailableDeliveryPartners();
      res.json({ partners });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery partners", error });
    }
  });

  app.patch("/api/delivery-partners/:userId/location", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { lat, lng } = req.body;
      
      await storage.updateDeliveryPartnerLocation(userId, lat, lng);
      res.json({ message: "Location updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update location", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
