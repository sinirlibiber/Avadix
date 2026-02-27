import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Shared validation parsing wrapper to log Zod errors nicely
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useMarkets(category?: string) {
  const url = category && category !== 'All' 
    ? `${api.markets.list.path}?category=${encodeURIComponent(category)}`
    : api.markets.list.path;

  return useQuery({
    queryKey: [api.markets.list.path, category],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch markets");
      const data = await res.json();
      return parseWithLogging(api.markets.list.responses[200], data, "markets.list");
    },
  });
}

export function useMarket(id: number) {
  return useQuery({
    queryKey: [api.markets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.markets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch market");
      const data = await res.json();
      return parseWithLogging(api.markets.get.responses[200], data, "markets.get");
    },
    enabled: !!id,
  });
}

type CreateMarketInput = z.infer<typeof api.markets.create.input>;

export function useCreateMarket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMarketInput) => {
      const validated = api.markets.create.input.parse(data);
      const res = await fetch(api.markets.create.path, {
        method: api.markets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create market");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.markets.create.responses[201], responseData, "markets.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.markets.list.path] });
    },
  });
}
