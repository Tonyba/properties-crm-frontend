import { queryOptions, useQuery } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import { useParams } from "react-router";
import type { GenericResponse, GetSingleResponse, Lead } from "@/helpers/types";

/*const getFromCache = (id: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([`lead/${id}`]);
};
*/

export const useSingleLeadSuspense = (updating?: boolean) => {

    const { id } = useParams();

    return queryOptions({
        queryKey: [`lead/${id}`],
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

    return useQuery({
        queryKey: [`lead/${id}`],
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