import { queryOptions, type QueryClient } from "@tanstack/react-query"
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { leads_list } from "../api/leads";

const getFromCache = (key: string, queryClient: QueryClient) => {
    return queryClient.getQueryData(['leads', 'list', key]);
};

export const useLeadsList = (request: ListLeadRequest, queryClient: QueryClient) => queryOptions({
    queryKey: ['leads', 'list', request.page ?? 1],
    queryFn: async (): Promise<GetLeadsResponse> => {
        const cache = getFromCache((request.page ?? 1).toString(), queryClient);
        if (cache) return cache as GetLeadsResponse;

        const data = await leads_list(request);

        return data.data;
    },
});
