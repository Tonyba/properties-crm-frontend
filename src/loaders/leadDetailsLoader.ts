import { type QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs } from 'react-router';
import { useSingleLead } from "../hooks/useSingleLead";


export const leadDetailsLoader = (_queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    const leadId = params.leadId ?? '';
    const resp = await _queryClient.ensureQueryData(useSingleLead(leadId, false, _queryClient));
    return resp;
}