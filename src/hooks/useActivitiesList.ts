import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { getFromCache } from "../helpers/helpers";
import { get_activities } from "../api/events";
import { useParams } from "react-router";
import { useModuleHeader } from "./useModuleHeader";

export const useActivitiesList = <T>(request: ListLeadRequest<T>) => {
    const queryClient = useQueryClient();
    const { leadId } = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useQuery({
        queryKey: [`${moduleSingle}/detail/${leadId}/list`, `${moduleSingle}/detail/${leadId}/list-page/${request.page}`],
        queryFn: async () => {
            const cache = getFromCache<GetLeadsResponse<T>>(`${moduleSingle}/detail/${leadId}/list-page/${request.page}`, queryClient);
            if (cache) return cache;
            if (leadId) request.filters = { ...request.filters, relation: leadId } as T;

            const data = await get_activities<T>(request);
            return data.data;
        }
    });
}