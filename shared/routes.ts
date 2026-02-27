import { z } from 'zod';
import { insertMarketSchema, markets, insertCampaignSchema, campaigns } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  markets: {
    list: {
      method: 'GET' as const,
      path: '/api/markets' as const,
      input: z.object({
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof markets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/markets/:id' as const,
      responses: {
        200: z.custom<typeof markets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/markets' as const,
      input: insertMarketSchema.extend({
        endTime: z.string().or(z.date()),
        resolutionTime: z.string().or(z.date()),
        initialLiquidity: z.coerce.number().min(0.2),
      }),
      responses: {
        201: z.custom<typeof markets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/campaigns' as const,
      responses: {
        200: z.array(z.custom<typeof campaigns.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/campaigns' as const,
      input: insertCampaignSchema,
      responses: {
        201: z.custom<typeof campaigns.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    donate: {
      method: 'POST' as const,
      path: '/api/campaigns/:id/donate' as const,
      input: z.object({
        amount: z.coerce.number().positive(),
        donorAddress: z.string(),
      }),
      responses: {
        200: z.custom<typeof campaigns.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateMarketInput = z.infer<typeof api.markets.create.input>;
export type MarketResponse = z.infer<typeof api.markets.create.responses[201]>;
export type MarketsListResponse = z.infer<typeof api.markets.list.responses[200]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
