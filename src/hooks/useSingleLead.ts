import { QueryClient, queryOptions } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import type { Lead } from "../helpers/types";

const getFromCache = (id: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([`lead/${id}`]);
};

export const useSingleLead = (id: string, updating: boolean, queryClient: QueryClient) => queryOptions({
    queryKey: [`lead/${id}`],
    queryFn: async () => {

        if (!id) return {};
        const cache = getFromCache((id), queryClient);
        if (cache) return cache as Lead;

        const response = await get_lead(id, updating);
        if (response.data.ok) {
            return response.data.lead;
        }
    }
});
