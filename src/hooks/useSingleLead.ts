import { queryOptions, useQuery } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import { useParams } from "react-router";
import type { GenericResponse, GetSingleResponse, Lead } from "@/helpers/types";
import { useModuleHeader } from "./useModuleHeader";

/*const getFromCache = (id: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([`lead/${id}`]);
};
*/

export const useSingleLeadSuspense = (updating?: boolean) => {

    const { id } = useParams();

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return queryOptions({
        queryKey: [`${moduleSingle ?? 'Lead'}/${id}`],
        queryFn: async () => {

            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead<GetSingleResponse<Lead>>(id, updating ?? false);

            if ((response.data as GenericResponse).ok) {
                return (response.data as GenericResponse).data as Lead;
            }
        }
    });
}


export const useSingleLead = (updating?: boolean) => {

    const { id } = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useQuery({
        queryKey: [`${moduleSingle}/${id}`],
        queryFn: async () => {
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;

            const response = await get_lead<GetSingleResponse<Lead>>(id, updating ?? false);
            if ((response.data as GenericResponse).ok) {
                return (response.data as GenericResponse).data as Lead;
            }
        }
    });
} 