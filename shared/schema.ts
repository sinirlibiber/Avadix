import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  endTime: timestamp("end_time").notNull(),
  resolutionTime: timestamp("resolution_time").notNull(),
  yesLiquidity: numeric("yes_liquidity").notNull().default('0'),
  noLiquidity: numeric("no_liquidity").notNull().default('0'),
  totalVolume: numeric("total_volume").notNull().default('0'),
  status: text("status").notNull().default('active'), // active, resolved, closed
  resolvedOutcome: text("resolved_outcome"), // YES, NO, or null
  imageUrl: text("image_url"),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetAmount: numeric("target_amount").notNull(),
  raisedAmount: numeric("raised_amount").notNull().default('0'),
  imageUrl: text("image_url"),
  creatorAddress: text("creator_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  donorAddress: text("donor_address").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertMarketSchema = createInsertSchema(markets).omit({ 
  id: true, 
  yesLiquidity: true, 
  noLiquidity: true, 
  totalVolume: true, 
  status: true, 
  resolvedOutcome: true 
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  raisedAmount: true,
  createdAt: true,
});

// === EXPLICIT API CONTRACT TYPES ===
export type Market = typeof markets.$inferSelect;
export type InsertMarket = z.infer<typeof insertMarketSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export interface CreateMarketRequest extends InsertMarket {
    initialLiquidity: number;
}

export type MarketResponse = Market;
export type MarketsListResponse = Market[];
