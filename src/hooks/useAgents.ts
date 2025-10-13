import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_agents } from "../api/leads";

import { type Agent } from '../helpers/types';

const getFromCache = (queryClient: QueryClient) => {
    return queryClient.getQueryData<Agent[]>(['agents']);
};

export const useAgents = () => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const cache = getFromCache(queryClient);
            if (cache) return cache;
            const resp = await get_agents();
            return resp.data;
        }
    }, queryClient);

} 