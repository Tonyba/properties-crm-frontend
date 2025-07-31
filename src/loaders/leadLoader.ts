import { type LoaderFunctionArgs } from 'react-router';
import { queryOptions, type QueryClient } from "@tanstack/react-query"
import { get_agents, get_selects } from '../api/leads';

export const selectsLeadQuery = () => queryOptions({
    queryKey: ['add_selects'],
    queryFn: () => get_selects()
})

export const agentsQuery = (agentName: string) => queryOptions({
    queryKey: ['agents_select'],
    queryFn: () => get_agents(agentName)
});

export const leadAddLoader = (_queryClient: QueryClient) =>
    async ({ request }: LoaderFunctionArgs) => {
        const resp = await _queryClient.ensureQueryData(selectsLeadQuery());
        return resp.data;
    }