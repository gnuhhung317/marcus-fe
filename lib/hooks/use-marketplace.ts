import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketplacePageData, getMarketplaceBotDetail, favoriteBot } from '@/lib/contracts/client';
import { MarketplaceQueryParams, MarketplacePageData, BotDetail } from '@/lib/contracts/types';

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  list: (query: MarketplaceQueryParams) => [...marketplaceKeys.all, 'list', query] as const,
  detail: (botId: string) => [...marketplaceKeys.all, 'detail', botId] as const,
};

export function useMarketplace(query: MarketplaceQueryParams = {}) {
  return useQuery<MarketplacePageData>({
    queryKey: marketplaceKeys.list(query),
    queryFn: () => getMarketplacePageData(query),
  });
}

export function useMarketplaceBot(botId: string, initialData?: BotDetail) {
  const queryClient = useQueryClient();

  const query = useQuery<BotDetail>({
    queryKey: marketplaceKeys.detail(botId),
    queryFn: () => getMarketplaceBotDetail(botId),
    initialData,
  });

  const favoriteMutation = useMutation({
    mutationFn: () => favoriteBot(botId),
    onSuccess: (data) => {
      // Update the local cache with favorited status if the backend returned it
      queryClient.setQueryData<BotDetail>(marketplaceKeys.detail(botId), (prev) => {
        if (!prev) return prev;
        // Assuming BotDetail has a favorited field (need to verify types.ts)
        return { ...prev, favorited: data.favorited };
      });
      // Invalidate list to refresh favorite icons
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
    },
  });

  return {
    ...query,
    toggleFavorite: favoriteMutation,
  };
}
