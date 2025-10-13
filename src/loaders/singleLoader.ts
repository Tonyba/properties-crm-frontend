import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs } from 'react-router';
import type { AxiosResponse } from "axios";
import type { GenericResponse } from "../helpers/types";

export const singleLoader = (
    _queryClient: QueryClient,
    getFn: (id: string, editing?: boolean) => Promise<AxiosResponse<GenericResponse, any>>,
    key: string
) => async ({ params }: LoaderFunctionArgs) => {
    const id = params.id ?? '';
    const resp = await _queryClient.ensureQueryData(
        queryOptions({
            queryKey: [`${key}/${id}`],
            queryFn: async () => {
                if (!id) return {};
                // const cache = getFromCache((id), queryClient);
                // if (cache) return cache as Lead;
                const response = await getFn(id);
                if (response.data.ok) {
                    return response.data.data;
                }
            }
        })
    );
    return resp;
}