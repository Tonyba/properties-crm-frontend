import axios from "axios";
import { API_URL } from "../helpers/constants";

import type { CreateLeadRequest, GenericResponse, GetLeadsResponse, GetSingleResponse, ListLeadRequest, Opportunity } from "../helpers/types";

export const create_opportunity = (data: Opportunity) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'new_opportunity', fields: JSON.stringify(data) }));
export const edit_opportunity = (data: Opportunity) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'edit_opportunity', fields: JSON.stringify(data) }));

export const get_opportunity = <T>(id: string, updating?: boolean) => axios.post<GetSingleResponse<T & GenericResponse>>(`${API_URL}`, new URLSearchParams({ action: 'get_opportunity', id, updating: JSON.stringify(updating) }));

export const get_stages = <T>() => axios.post<GetSingleResponse<T>>(`${API_URL}`, new URLSearchParams({ action: 'get_stages' }));

export const opportunities_list = (request: ListLeadRequest<Opportunity>) => {


    const url_params = {
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    }

    const params = new URLSearchParams(url_params);
    return axios.post<GetLeadsResponse<Opportunity>>(
        `${API_URL}?action=get_opportunies`, params);
}

export const get_sources = () => axios.post(`${API_URL}`, new URLSearchParams({ action: 'get_sources' }));

export const get_related_services = async <T>(id: string) => {

    try {

        const resp = await axios.post<T[]>(`${API_URL}?action=related_services`, new URLSearchParams({ id }));
        return resp.data;

    } catch (error) {
        console.log(error)
    }

}