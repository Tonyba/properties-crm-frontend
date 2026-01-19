import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_services } from "../api/properties";

const getFromCache = (queryClient: QueryClient) => {
    return queryClient.getQueryData<{ id: number, title: string }[]>(['services']);
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