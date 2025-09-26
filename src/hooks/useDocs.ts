import { queryOptions } from "@tanstack/react-query";
import { get_related_documents } from "../api/documents";
import type { BoxData } from "../helpers/types";


export const useRelatedDocs = <T>(related_id: string, key: string) => queryOptions({
    queryKey: [`${key}/${related_id}`],
    queryFn: async () => {

        let resp: BoxData<T> = {};

        switch (key) {
            case 'Documents':
                resp = await get_related_documents(related_id);
                break;

            case 'Activities':
                resp.data = [];
                break;

            case 'Comments':
                resp.data = [];
                break;

            default:
                break;
        }

        return resp.data;
    }
});

