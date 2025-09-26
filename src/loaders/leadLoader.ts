import { queryOptions, type QueryClient } from "@tanstack/react-query"
import { get_selects } from '../api/leads';

export const selectsLeadQuery = () => queryOptions({
    queryKey: ['add_selects'],
    queryFn: () => get_selects()
})

export const leadAddLoader = (_queryClient: QueryClient) =>
    async () => {
        const resp = await _queryClient.ensureQueryData(selectsLeadQuery());
        return resp.data;
    }