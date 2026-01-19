import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_stages } from "../api/opportunities";
import type { SelectOption } from "../helpers/types";

const getFromCache = (queryClient: QueryClient) => {
    return queryClient.getQueryData<{ id: number, title: string }[]>(['stages']);
};

export const useStages = () => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['stages'],
        queryFn: async () => {
            const cache = getFromCache(queryClient);
            if (cache) return cache;
            const resp = await get_stages<SelectOption[]>();
            return resp.data.data;
        }
    }, queryClient);

} 