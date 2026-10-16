import { EVENT_CONFIG } from "@/data-access-layer/event-config";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
    },
  },
});
