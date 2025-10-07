import { QueryClient, queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import { useParams } from "react-router";

const getFromCache = (id: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([`lead/${id}`]);
};


export const useSingleLeadSuspense = (updating?: boolean) => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    return queryOptions({
        queryKey: [`lead/${id}`],
        queryFn: async () => {
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead(id, updating ?? false);
            if (response.data.ok) {
                return response.data.lead;
            }
        }
    });
}


export const useSingleLead = (updating?: boolean) => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: [`lead/${id}`],
        queryFn: async () => {
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead(id, updating ?? false);
            if (response.data.ok) {
                return response.data.lead;
            }
        }
    });
} 