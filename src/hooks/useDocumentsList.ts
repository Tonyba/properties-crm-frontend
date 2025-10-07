import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { useParams } from "react-router";
import { getFromCache } from "../helpers/helpers";
import { get_documents_list } from "../api/documents";
import { useModuleHeader } from "./useModuleHeader";


export const useDocumentsList = <T>(request: ListLeadRequest<T>) => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useQuery({
        queryKey: [`${moduleSingle}-docs/detail/${id}/list`, `${moduleSingle}-docs/detail/${id}/list-page/${request.page}`],
        queryFn: async () => {
            const cache = getFromCache<GetLeadsResponse<T>>(`${moduleSingle}-docs/detail/${id}/list-page/${request.page}`, queryClient);
            if (cache) return cache;
            if (id) request.filters = { ...request.filters, relation: id } as T;

            const data = await get_documents_list<T>(request);
            return data.data;
        }
    });
}