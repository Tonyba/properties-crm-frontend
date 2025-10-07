import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs } from 'react-router';
import { get_lead } from "../api/leads";

export const leadDetailsLoader = (_queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    const id = params.id ?? '';
    const resp = await _queryClient.ensureQueryData(
        queryOptions({
            queryKey: [`lead/${id}`],
            queryFn: async () => {
                if (!id) return {};
                // const cache = getFromCache((id), queryClient);
                // if (cache) return cache as Lead;
                const response = await get_lead(id, false);
                if (response.data.ok) {
                    return response.data.lead;
                }
            }
        })
    );
    return resp;
}