import { queryOptions, type QueryClient } from "@tanstack/react-query"
import { get_properties_by_name } from "../api/properties";

const getFromCache = (key: string, queryClient: QueryClient) => {
    return queryClient.getQueryData([key]);
};

export const searchPropertyByName = (name: string, queryClient: QueryClient) => queryOptions({
    queryKey: [`properties_by_name/${name}`],
    queryFn: async () => {
        const cache = getFromCache(`properties_by_name/${name}`, queryClient);
        if (cache) return cache;

        const data = await get_properties_by_name(name);

        return data.data;
    },
    enabled: name.length >= 3
});

export const searchPropertyById = (id: string, queryClient: QueryClient) => queryOptions({
    queryKey: [`properties_by_id/${id}`],
    queryFn: async () => {
        const cache = getFromCache(`properties_by_id/${id}`, queryClient);
        if (cache) return cache;

        const data = await get_properties_by_name('', id);

        return data.data;
    }
});