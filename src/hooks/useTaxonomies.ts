import { useQuery } from "@tanstack/react-query";
import { get_taxonomies_terms } from "../api/taxonomies";

type KeyTaxonomy = 'document' | 'task' | 'event' | 'property' | 'lead' | 'contact' | 'opportunity';

export const useTaxonomiesInLoop = () => {
    return {
        execFn: (key: KeyTaxonomy) => useQuery({
            queryKey: [`${key}_taxonomies`],
            queryFn: async () => {
                const response = await get_taxonomies_terms(key);
                return response.data;
            }
        })
    }
}

export const useTaxonomies = (key: KeyTaxonomy) => {
    return useQuery({
        queryKey: [`${key}_taxonomies`],
        queryFn: async () => {
            const response = await get_taxonomies_terms(key);
            return response.data;
        }
    });
}