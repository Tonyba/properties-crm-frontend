import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import type { GetLeadsResponse, ListLeadRequest } from "../helpers/types";
import { useModuleHeader } from "./useModuleHeader";
import type { AxiosResponse } from "axios";

const getFromCache = (key: string, page: number, queryClient: QueryClient) => {
    return queryClient.getQueryData([`${key}/list`, `${key}/list/${page}`]);
};

export const useSingleList = <T>(request: ListLeadRequest<T>, listFn: (request: ListLeadRequest<T>) => Promise<AxiosResponse<GetLeadsResponse<T>, any>>) => {
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: [`${moduleSingle}/list`, `${moduleSingle}/list/${request.page ?? 1}`],
        queryFn: async (): Promise<GetLeadsResponse<T>> => {
            const cache = getFromCache(moduleSingle ?? 'module', (request.page ?? 1), queryClient);
            if (cache) return cache as GetLeadsResponse<T>;
            const data = await listFn(request);
            return data.data;
        },
    });
}
