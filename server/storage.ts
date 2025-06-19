import { users, orders, deliveryPartners, type User, type InsertUser, type Order, type InsertOrder, type DeliveryPartner, type InsertDeliveryPartner, type OrderWithDetails } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<OrderWithDetails | undefined>;
  getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]>;
  getActiveOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]>;
  updateOrderStatus(id: number, status: string, deliveryPartnerId?: number): Promise<Order | undefined>;
  getAllPendingOrders(): Promise<OrderWithDetails[]>;

  // Delivery partner operations
  createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner>;
  getDeliveryPartner(userId: number): Promise<DeliveryPartner | undefined>;
  getAvailableDeliveryPartners(): Promise<(DeliveryPartner & { user: User })[]>;
  updateDeliveryPartnerLocation(userId: number, lat: number, lng: number): Promise<void>;
  updateDeliveryPartnerAvailability(userId: number, isAvailable: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private deliveryPartners: Map<number, DeliveryPartner>;
  private currentUserId: number;
  private currentOrderId: number;
  private currentPartnerId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.deliveryPartners = new Map();
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.currentPartnerId = 1;

    // Create some demo users and delivery partners
    this.seedData();
  }

  private async seedData() {
    // Create demo customer
    const customer = await this.createUser({
      username: "demo_customer",
      password: "password123",
      fullName: "Demo Customer",
      phoneNumber: "+91-9876543210",
      email: "customer@example.com",
      isDeliveryPartner: false,
    });

    // Create demo delivery partner
    const partnerUser = await this.createUser({
      username: "rahul_delivery",
      password: "password123",
      fullName: "Rahul Kumar",
      phoneNumber: "+91-9876543211",
      email: "rahul@example.com",
      isDeliveryPartner: true,
    });

    await this.createDeliveryPartner({
      userId: partnerUser.id,
      vehicleType: "bike",
      vehicleNumber: "MH02AB1234",
      licenseNumber: "DL123456789",
      isAvailable: true,
      currentLat: "19.0760",
      currentLng: "72.8777",
      rating: "4.8",
      totalDeliveries: 150,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser,
      id,
      email: insertUser.email || null,
      isDeliveryPartner: insertUser.isDeliveryPartner || false,
      profileImage: insertUser.profileImage || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      deliveryPartnerId: null,
      actualPrice: null,
      pickupLat: null,
      pickupLng: null,
      dropoffLat: null,
      dropoffLng: null,
      packageWeight: null,
      distance: insertOrder.distance || null,
      specialInstructions: insertOrder.specialInstructions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<OrderWithDetails | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const customer = this.users.get(order.customerId);
    if (!customer) return undefined;

    let deliveryPartner;
    if (order.deliveryPartnerId) {
      const partnerUser = this.users.get(order.deliveryPartnerId);
      const partnerDetails = Array.from(this.deliveryPartners.values()).find(p => p.userId === order.deliveryPartnerId);
      if (partnerUser && partnerDetails) {
        deliveryPartner = { ...partnerUser, partnerDetails };
      }
    }

    return {
      ...order,
      customer,
      deliveryPartner,
    };
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]> {
    const customerOrders = Array.from(this.orders.values()).filter(
      order => order.customerId === customerId
    );

    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const order of customerOrders) {
      const customer = this.users.get(order.customerId);
      if (!customer) continue;

      let deliveryPartner;
      if (order.deliveryPartnerId) {
        const partnerUser = this.users.get(order.deliveryPartnerId);
        const partnerDetails = Array.from(this.deliveryPartners.values()).find(p => p.userId === order.deliveryPartnerId);
        if (partnerUser && partnerDetails) {
          deliveryPartner = { ...partnerUser, partnerDetails };
        }
      }

      ordersWithDetails.push({
        ...order,
        customer,
        deliveryPartner,
      });
    }

    return ordersWithDetails.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getActiveOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]> {
    const allOrders = await this.getOrdersByCustomer(customerId);
    return allOrders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  }

  async updateOrderStatus(id: number, status: string, deliveryPartnerId?: number): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      status,
      deliveryPartnerId: deliveryPartnerId || order.deliveryPartnerId,
      updatedAt: new Date(),
    };

    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAllPendingOrders(): Promise<OrderWithDetails[]> {
    const pendingOrders = Array.from(this.orders.values()).filter(
      order => order.status === 'pending'
    );

    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const order of pendingOrders) {
      const customer = this.users.get(order.customerId);
      if (!customer) continue;

      ordersWithDetails.push({
        ...order,
        customer,
      });
    }

    return ordersWithDetails;
  }

  async createDeliveryPartner(insertPartner: InsertDeliveryPartner): Promise<DeliveryPartner> {
    const id = this.currentPartnerId++;
    const partner: DeliveryPartner = {
      ...insertPartner,
      id,
      isAvailable: insertPartner.isAvailable ?? true,
      currentLat: insertPartner.currentLat || null,
      currentLng: insertPartner.currentLng || null,
      rating: insertPartner.rating || "5.0",
      totalDeliveries: insertPartner.totalDeliveries || 0,
      createdAt: new Date(),
    };
    this.deliveryPartners.set(id, partner);
    return partner;
  }

  async getDeliveryPartner(userId: number): Promise<DeliveryPartner | undefined> {
    return Array.from(this.deliveryPartners.values()).find(
      partner => partner.userId === userId
    );
  }

  async getAvailableDeliveryPartners(): Promise<(DeliveryPartner & { user: User })[]> {
    const availablePartners = Array.from(this.deliveryPartners.values()).filter(
      partner => partner.isAvailable
    );

    const partnersWithUsers: (DeliveryPartner & { user: User })[] = [];
    
    for (const partner of availablePartners) {
      const user = this.users.get(partner.userId);
      if (user) {
        partnersWithUsers.push({ ...partner, user });
      }
    }

    return partnersWithUsers;
  }

  async updateDeliveryPartnerLocation(userId: number, lat: number, lng: number): Promise<void> {
    const partner = Array.from(this.deliveryPartners.values()).find(p => p.userId === userId);
    if (partner) {
      partner.currentLat = lat.toString();
      partner.currentLng = lng.toString();
      this.deliveryPartners.set(partner.id, partner);
    }
  }

  async updateDeliveryPartnerAvailability(userId: number, isAvailable: boolean): Promise<void> {
    const partner = Array.from(this.deliveryPartners.values()).find(p => p.userId === userId);
    if (partner) {
      partner.isAvailable = isAvailable;
      this.deliveryPartners.set(partner.id, partner);
    }
  }
}

export const storage = new MemStorage();
