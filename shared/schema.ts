import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  isDeliveryPartner: boolean("is_delivery_partner").default(false),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  deliveryPartnerId: integer("delivery_partner_id").references(() => users.id),
  pickupAddress: text("pickup_address").notNull(),
  pickupPersonName: text("pickup_person_name").notNull(),
  pickupPersonPhone: text("pickup_person_phone").notNull(),
  dropoffAddress: text("dropoff_address").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  pickupLat: decimal("pickup_lat", { precision: 10, scale: 8 }),
  pickupLng: decimal("pickup_lng", { precision: 11, scale: 8 }),
  dropoffLat: decimal("dropoff_lat", { precision: 10, scale: 8 }),
  dropoffLng: decimal("dropoff_lng", { precision: 11, scale: 8 }),
  packageSize: text("package_size").notNull(), // 'small', 'medium', 'large'
  packageWeight: decimal("package_weight", { precision: 5, scale: 2 }),
  distance: decimal("distance", { precision: 8, scale: 2 }),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }).notNull(),
  actualPrice: decimal("actual_price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'pickup', 'in_transit', 'delivered', 'cancelled'
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveryPartners = pgTable("delivery_partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  vehicleType: text("vehicle_type").notNull(), // 'bike', 'car', 'van'
  vehicleNumber: text("vehicle_number").notNull(),
  licenseNumber: text("license_number").notNull(),
  isAvailable: boolean("is_available").default(true),
  currentLat: decimal("current_lat", { precision: 10, scale: 8 }),
  currentLng: decimal("current_lng", { precision: 11, scale: 8 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  totalDeliveries: integer("total_deliveries").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deliveryPartnerId: true,
  actualPrice: true,
  pickupLat: true,
  pickupLng: true,
  dropoffLat: true,
  dropoffLng: true,
  packageWeight: true,
});

export const insertDeliveryPartnerSchema = createInsertSchema(deliveryPartners).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertDeliveryPartner = z.infer<typeof insertDeliveryPartnerSchema>;
export type DeliveryPartner = typeof deliveryPartners.$inferSelect;

// Extended types for API responses
export type OrderWithDetails = Order & {
  customer: User;
  deliveryPartner?: User & { partnerDetails: DeliveryPartner };
};
