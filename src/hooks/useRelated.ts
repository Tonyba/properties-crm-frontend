import { queryOptions } from "@tanstack/react-query";
import { get_related_documents } from "../api/documents";
import type { BoxData } from "../helpers/types";
import { useModuleHeader } from "./useModuleHeader";
import { get_related_activities } from "../api/events";
import { get_related_services } from "@/api/opportunities";


export const useRelated = <T>(related_id: string, key: string) => {
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return queryOptions({
        queryKey: [`${moduleSingle}/${key}/${related_id}`],
        queryFn: async () => {
            let resp: BoxData<T> = {};
            switch (key) {
                case 'Documents':
                    resp = await get_related_documents(related_id);
                    break;

                case 'Activities':
                    resp = await get_related_activities(related_id);
                    break;

                case 'Comments':
                    resp.data = [];
                    break;

                case 'Related Services':
                    resp.data = await get_related_services(related_id);
                    break;

                default:
                    break;
            }

            return resp.data;
        }
    });
}

