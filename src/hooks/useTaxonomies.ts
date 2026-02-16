import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_taxonomies_terms } from "../api/taxonomies";
import type { KeyTaxonomy } from "@/helpers/types";


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

export const useTaxonomies = (key?: KeyTaxonomy) => {

    return useQuery({
        queryKey: [`${key}_taxonomies`],
        queryFn: async () => {
            if (!key) return {};
            const response = await get_taxonomies_terms(key);
            return response.data;
        }
    });
}

export const useMutateTaxonomies = (key?: KeyTaxonomy) => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: get_taxonomies_terms,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${key}_taxonomies`] });
        }
    });

}