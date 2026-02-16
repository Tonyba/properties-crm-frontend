import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { useParams } from "react-router";
import { getEmails, getFromCache } from "../helpers/helpers";
import { useModuleHeader } from "./useModuleHeader";

export type useEmailRequest<T> = ListLeadRequest<T> & { id: string };

export const useEmails = <T>(request: useEmailRequest<T>) => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useQuery({
        queryKey: [`${moduleSingle}-emails/detail/${id}/list`, `${moduleSingle}-emails/detail/${id}/list-page/${request.page}`],
        queryFn: async () => {
            const cache = getFromCache<GetLeadsResponse<T>>(`${moduleSingle}-emails/detail/${id}/list-page/${request.page}`, queryClient);
            if (cache) return cache;

            const data = await getEmails(request);
            return data.data;
        }
    });
}