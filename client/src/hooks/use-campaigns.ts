import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "../lib/queryClient";
import { Campaign, InsertCampaign } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: [api.campaigns.list.path],
  });
}

export function useCreateCampaign() {
  return useMutation({
    mutationFn: async (campaign: InsertCampaign) => {
      const res = await apiRequest("POST", api.campaigns.create.path, campaign);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.list.path] });
    },
  });
}

export function useDonate() {
  return useMutation({
    mutationFn: async ({ id, amount, donorAddress }: { id: number; amount: number; donorAddress: string }) => {
      const res = await apiRequest("POST", buildUrl(api.campaigns.donate.path, { id }), { amount, donorAddress });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.list.path] });
    },
  });
}
