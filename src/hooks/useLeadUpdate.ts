import { QueryClient, useMutation } from "@tanstack/react-query";
import { edit_lead } from "../api/leads";
import type { Lead } from "../helpers/types";


export const useLeadUpdate = (id: string, lead: Lead, queryClient: QueryClient) => {
    return useMutation({
        mutationFn: edit_lead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`updates/${id}`] });
            await queryClient.invalidateQueries({ queryKey: ['leads/list'] });
            await queryClient.invalidateQueries({ queryKey: ['Leads/list'] });
            await queryClient.invalidateQueries({ queryKey: [`lead/${id}`] });
            await queryClient.invalidateQueries({ queryKey: [`Lead/${id}`] });
        },
        onMutate: async (newLead: Lead) => {
            await queryClient.cancelQueries({ queryKey: [`updates/${id}`] });
            await queryClient.cancelQueries({ queryKey: [`lead/${id}`] });
            await queryClient.cancelQueries({ queryKey: [`Lead/${id}`] });
            queryClient.setQueryData([`Lead/${id}`], newLead);
            return lead;
        },
        onError: () => {
            console.log('some error')
        }
    });
}
