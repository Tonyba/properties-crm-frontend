import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs } from 'react-router';
import { get_lead } from "../api/leads";
import type { GenericResponse, Lead } from "../helpers/types";

export const leadDetailsLoader = (_queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    const id = params.id ?? '';
    const resp = await _queryClient.ensureQueryData(
        queryOptions({
            queryKey: [`lead/${id}`],
            queryFn: async () => {
                if (!id) return {};
                // const cache = getFromCache((id), queryClient);
                // if (cache) return cache as Lead;
                const response = await get_lead<GenericResponse>(id, false);
                return response.data.data as Lead;
            }
        })
    );
    return resp;
}