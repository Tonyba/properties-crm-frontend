import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useModuleHeader } from "./useModuleHeader";
import { get_contact } from "../api/contacts";
import { get_lead } from "../api/leads";

type UseGetSingleParams = {
    get_fn?: (id: string, updating?: boolean) => Promise<any>,
    updating?: boolean
}

export const useGetSingle = <T>({ get_fn, updating }: UseGetSingleParams) => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useQuery({
        queryKey: [`${moduleSingle}/${id}`],
        queryFn: async () => {
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead
            if (!id) return {} as T;

            let resp;

            if (get_fn) {
                const response = await get_fn(id!, updating ?? false);
                return response.data.data;

            } else {

                switch (moduleSingle) {
                    case 'Contact':
                        resp = await get_contact(id, updating)
                        break;

                    case 'Lead':
                        resp = await get_lead(id, updating)
                        break;

                    default:
                        break;
                }

            }

            return resp.data.data as T;
        }
    });
}

export const useGetSingleSuspense = (get_fn: (id: string, updating?: boolean) => Promise<any>, updating?: boolean) => {

    const { id } = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return queryOptions({
        queryKey: [`${moduleSingle}/${id}`],
        queryFn: async () => {
            console.log(id)
            if (!id) return {};
            // const cache = getFromCache((id), queryClient);
            // if (cache) return cache as Lead;
            const response = await get_fn(id, updating ?? false);
            if (response.data.ok) {
                return response.data.data;
            }
        }
    });
} 