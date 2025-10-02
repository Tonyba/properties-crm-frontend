import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { getFromCache } from "../helpers/helpers";
import { get_activities } from "../api/events";

export const useActivitiesList = <T>(key: string, request: ListLeadRequest<T>) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [`${key}/detail/list`, `${key}-detail/list-page/${request.page}`],
        queryFn: async () => {
            const cache = getFromCache<GetLeadsResponse<T>>(`${key}-detail/list-page/${request.page}`, queryClient);
            if (cache) return cache;
            const data = await get_activities<T>(request);
            return data.data;
        }
    });
}