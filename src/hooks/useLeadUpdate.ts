import { QueryClient, useMutation } from "@tanstack/react-query";
import { edit_lead } from "../api/leads";
import type { Lead } from "../helpers/types";


export const useLeadUpdate = (leadId: string, lead: Lead, queryClient: QueryClient) => {
    return useMutation({
        mutationFn: edit_lead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`updates/${leadId}`] });
            await queryClient.invalidateQueries({ queryKey: ['leads', 'list'] });
            await queryClient.invalidateQueries({ queryKey: [`lead/${leadId}`] });
        },
        onMutate: async (newLead: Lead) => {
            await queryClient.cancelQueries({ queryKey: [`updates/${leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`lead/${leadId}`] });
            queryClient.setQueryData([`lead/${leadId}`], newLead);
            return lead;
        },
        onError: () => {
            console.log('some error')
        }
    });
}
