import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { Event, GenericResponse, GetLeadsResponse, ListLeadRequest, WithDataId } from "../helpers/types";


export const create_event = (event: Event) => axios.post<GenericResponse & WithDataId>(`${API_URL}?action=create_event`, new URLSearchParams({ fields: JSON.stringify(event) }));
export const edit_event = (event: Event) => axios.post<GenericResponse>(`${API_URL}?action=edit_event`, new URLSearchParams({ fields: JSON.stringify(event) }));
export const get_activities = <T>(request: ListLeadRequest<T>) => {
    const params = new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })

    return axios.post<GetLeadsResponse<T>>(`${API_URL}?action=activities_list`, params);
}
export const get_related_activities = <T>(id: string) => axios.post<T[]>(`${API_URL}?action=related_activities`, new URLSearchParams({ id }));