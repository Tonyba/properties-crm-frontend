import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_services } from "../api/properties";
import type { SelectOption } from "@/helpers/types";

const getFromCache = (queryClient: QueryClient) => {
    return queryClient.getQueryData<SelectOption[]>(['services']);
};

export const useServices = () => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const cache = getFromCache(queryClient);
            if (cache) return cache;
            const resp = await get_services();
            return resp.data;
        }
    }, queryClient);

} 