import { QueryClient, queryOptions } from "@tanstack/react-query";
import { contact_by_name_or_id } from "../api/contacts";
import { getFromCache } from "../helpers/helpers";

export const useSearchByNameQueryOptions = <T>(key: string, search: string, queryClient: QueryClient) => queryOptions({
    queryKey: [`${key}`],
    queryFn: async () => {
        const cache = getFromCache(`${key}`, queryClient);
        if (cache) return cache;

        const data = await contact_by_name_or_id<T>(search);
        return data.data;
    },
    enabled: search.length >= 3
});

export const useSearchByIdQueryOptions = <T>(key: string, id: string, queryClient: QueryClient) => queryOptions({
    queryKey: [`${key}`],
    queryFn: async () => {
        const cache = getFromCache(`${key}`, queryClient);
        if (cache) return cache;

        const data = await contact_by_name_or_id<T>('', id);
        return data.data;
    },
    enabled: id.length > 0
});