"use client";
import { useQuery } from "@tanstack/react-query";
import { requestJson } from "../lib/api/http";

async function fetchPlans(botId: string) {
  return requestJson(`/bots/${botId}/subscriptions`);
}

export function useSubscriptions(botId: string) {
  return useQuery({ queryKey: ["subscriptions", botId], queryFn: () => fetchPlans(botId), staleTime: 30_000 });
}
