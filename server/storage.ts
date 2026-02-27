import { db } from "./db";
import {
  markets,
  campaigns,
  donations,
  type InsertMarket,
  type MarketResponse,
  type CreateMarketRequest,
  type MarketsListResponse,
  type InsertCampaign,
  type Campaign
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getMarkets(category?: string): Promise<MarketsListResponse>;
  getMarket(id: number): Promise<MarketResponse | undefined>;
  createMarket(market: CreateMarketRequest): Promise<MarketResponse>;
  
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  donateToCampaign(campaignId: number, amount: number, donorAddress: string): Promise<Campaign>;
}

export class DatabaseStorage implements IStorage {
  async getMarkets(category?: string): Promise<MarketsListResponse> {
    if (category && category !== "All") {
      return await db.select().from(markets).where(eq(markets.category, category));
    }
    return await db.select().from(markets);
  }

  async getMarket(id: number): Promise<MarketResponse | undefined> {
    const [market] = await db.select().from(markets).where(eq(markets.id, id));
    return market;
  }

  async createMarket(market: CreateMarketRequest): Promise<MarketResponse> {
    const { initialLiquidity, ...insertData } = market;
    
    const liquidityStr = (initialLiquidity / 2).toString();
    const volumeStr = initialLiquidity.toString();

    const [newMarket] = await db.insert(markets).values({
      ...insertData,
      endTime: new Date(insertData.endTime),
      resolutionTime: new Date(insertData.resolutionTime),
      yesLiquidity: liquidityStr,
      noLiquidity: liquidityStr,
      totalVolume: volumeStr,
      status: "active"
    }).returning();
    return newMarket;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async donateToCampaign(campaignId: number, amount: number, donorAddress: string): Promise<Campaign> {
    await db.insert(donations).values({
      campaignId,
      donorAddress,
      amount: amount.toString(),
    });

    const [updated] = await db.update(campaigns)
      .set({
        raisedAmount: sql`raised_amount + ${amount}`
      })
      .where(eq(campaigns.id, campaignId))
      .returning();
    
    if (!updated) throw new Error("Campaign not found");
    return updated;
  }
}

export const storage = new DatabaseStorage();
