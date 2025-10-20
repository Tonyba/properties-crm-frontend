import axios from "axios";
import { API_URL } from "../helpers/constants";

import type { CreateLeadRequest, GenericResponse, GetLeadsResponse, GetSingleResponse, ListLeadRequest, Opportunity } from "../helpers/types";

export const create_opportunity = (data: Opportunity) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'new_opportunity', fields: JSON.stringify(data) }));
export const edit_opportunity = (data: Opportunity) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'edit_opportunity', fields: JSON.stringify(data) }));

export const get_opportunity = <T>(id: string, updating?: boolean) => axios.post<GetSingleResponse<T & GenericResponse>>(`${API_URL}`, new URLSearchParams({ action: 'get_opportunity', id, updating: JSON.stringify(updating) }));

export const opportunities_list = <T>(request: ListLeadRequest<T>) => {

    const params = new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })

    return axios.post<GetLeadsResponse<T>>(
        `${API_URL}?action=get_opportunities`, params);
}