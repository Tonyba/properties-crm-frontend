import { useQuery } from "@tanstack/react-query";
import { get_taxonomies_terms } from "../api/taxonomies";

export const useTaxonomies = (key: 'document' | 'task' | 'event' | 'property' | 'lead') => {
    return useQuery({
        queryKey: [`${key}_taxonomies`],
        queryFn: async () => {
            const response = await get_taxonomies_terms(key);
            return response.data;
        }
    });
}