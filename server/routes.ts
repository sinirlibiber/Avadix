import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.markets.list.path, async (req, res) => {
    try {
      const { category } = req.query;
      const markets = await storage.getMarkets(category as string);
      res.json(markets);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.markets.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const market = await storage.getMarket(id);
      if (!market) {
        return res.status(404).json({ message: 'Market not found' });
      }
      res.json(market);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.markets.create.path, async (req, res) => {
    try {
      const input = api.markets.create.input.parse(req.body);
      const market = await storage.createMarket(input as any);
      res.status(201).json(market);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.campaigns.list.path, async (_req, res) => {
    const list = await storage.getCampaigns();
    res.json(list);
  });

  app.post(api.campaigns.create.path, async (req, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      const campaign = await storage.createCampaign({
        ...input,
        targetAmount: input.targetAmount.toString()
      });
      res.status(201).json(campaign);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.campaigns.donate.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.campaigns.donate.input.parse(req.body);
      const campaign = await storage.donateToCampaign(id, input.amount, input.donorAddress);
      res.json(campaign);
    } catch (err) {
      res.status(400).json({ message: "Donation failed" });
    }
  });

  // Seed the database after setup
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  try {
    const existing = await storage.getMarkets();
    if (existing.length === 0) {
      const now = new Date();
      const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      await storage.createMarket({
        question: "Will Avalanche (AVAX) reach $100 by the end of 2026?",
        description: "This market resolves to YES if the price of AVAX hits $100 on Binance by Dec 31, 2026.",
        category: "Crypto",
        endTime: future,
        resolutionTime: future,
        initialLiquidity: 500,
      });

      await storage.createMarket({
        question: "Will the next major AI model pass the Turing Test?",
        description: "This market resolves to YES if an AI model formally passes the Turing Test by 2027.",
        category: "Tech",
        endTime: new Date("2027-01-01T00:00:00Z"),
        resolutionTime: new Date("2027-01-02T00:00:00Z"),
        initialLiquidity: 200,
      });

      await storage.createMarket({
        question: "Will France win the 2026 FIFA World Cup?",
        description: "This market resolves to YES if France wins the 2026 FIFA World Cup in North America.",
        category: "Sports",
        endTime: new Date("2026-07-19T00:00:00Z"),
        resolutionTime: new Date("2026-07-20T00:00:00Z"),
        initialLiquidity: 150,
      });
      
      console.log("Database seeded successfully with initial markets!");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
