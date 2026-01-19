import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { useModuleHeader } from "./useModuleHeader";
import type { AxiosResponse } from "axios";
import { getFromCache } from "../helpers/helpers";


export const useSingleList = <T>(request: ListLeadRequest<T>, listFn: (request: ListLeadRequest<T>) => Promise<AxiosResponse<GetLeadsResponse<T>, any>>) => {
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: [`${moduleSingle}/list`, `${moduleSingle}/list/${request.page ?? 1}`],
        queryFn: async (): Promise<GetLeadsResponse<T>> => {
            const cache = getFromCache<GetLeadsResponse<T>>(`${moduleSingle}/list`, queryClient);
            if (cache) return cache;
            const data = await listFn(request);
            return data.data;
        },
    });
}
