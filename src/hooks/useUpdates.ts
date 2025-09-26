import { QueryClient, useQuery } from "@tanstack/react-query";
import { getUpdates } from "../api/updates";

export const useUpdates = <T>(id: string, queryClient: QueryClient) => {
    return useQuery({
        queryKey: [`updates/${id}`],
        queryFn: async () => {
            // const cache = getFromCache<T>(`updates/${id}`, queryClient);
            // if (cache) return cache;
            const resp = await getUpdates(id);
            return resp.data;
        }
    }, queryClient);
}