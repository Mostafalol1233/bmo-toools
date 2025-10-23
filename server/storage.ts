import { users, type User, type InsertUser, type Url, type InsertUrl } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createShortUrl(originalUrl: string, shortCode: string): Promise<Url>;
  getUrlByShortCode(shortCode: string): Promise<Url | undefined>;
  getAllUrls(): Promise<Url[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private urls: Map<number, Url>;
  private urlsByShortCode: Map<string, Url>;
  private currentUserId: number;
  private currentUrlId: number;

  constructor() {
    this.users = new Map();
    this.urls = new Map();
    this.urlsByShortCode = new Map();
    this.currentUserId = 1;
    this.currentUrlId = 1;
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createShortUrl(originalUrl: string, shortCode: string): Promise<Url> {
    const id = this.currentUrlId++;
    const url: Url = {
      id,
      originalUrl,
      shortCode,
      createdAt: new Date(),
    };
    this.urls.set(id, url);
    this.urlsByShortCode.set(shortCode, url);
    return url;
  }

  async getUrlByShortCode(shortCode: string): Promise<Url | undefined> {
    return this.urlsByShortCode.get(shortCode);
  }

  async getAllUrls(): Promise<Url[]> {
    return Array.from(this.urls.values());
  }
}

export const storage = new MemStorage();
