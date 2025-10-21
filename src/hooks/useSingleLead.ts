import { QueryClient, queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import { useParams } from "react-router";
import { useModuleHeader } from "./useModuleHeader";

const getFromCache = (id: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([`lead/${id}`]);
};


export const useSingleLeadSuspense = (updating?: boolean) => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return queryOptions({
        queryKey: [`${moduleSingle}/${id}`],
        queryFn: async () => {
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead(id, updating ?? false) as any;
            if (response.data.ok) {
                return response.data.lead;
            }
        }
    });
}


export const useSingleLead = (updating?: boolean) => {

    const { id } = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();


    return useQuery({
        queryKey: [`${moduleSingle}/${id}`],
        queryFn: async () => {
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead(id, updating ?? false) as any;
            if (response.data.ok) {
                return response.data.lead;
            }
        }
    });
} 