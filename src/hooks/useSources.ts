import { get_sources } from "@/api/opportunities";
import type { SelectOption } from "@/helpers/types";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";


const getFromCache = (queryClient: QueryClient) => {
    return queryClient.getQueryData<SelectOption[]>(['sources']);
};

export const useSources = () => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['sources'],
        queryFn: async () => {
            const cache = getFromCache(queryClient);
            if (cache) return cache;
            const resp = await get_sources();
            return resp.data.data;
        }
    }, queryClient);
}