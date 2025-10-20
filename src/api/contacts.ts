import axios from "axios";
import { API_URL } from "../helpers/constants";

import type { Contact, CreateLeadRequest, GenericResponse, GetLeadsResponse, GetSingleResponse, ListLeadRequest } from "../helpers/types";

export const create_contact = (data: Contact) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'new_contact', fields: JSON.stringify(data) }));
export const edit_contact = (data: Contact) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'edit_contact', fields: JSON.stringify(data) }));

export const get_contact = <T>(id: string, updating?: boolean) => axios.post<GetSingleResponse<T & GenericResponse>>(`${API_URL}`, new URLSearchParams({ action: 'get_contact', id, updating: JSON.stringify(updating) }));
export const contacts_list = <T>(request: ListLeadRequest<T>) => {

    const params = new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })

    return axios.post<GetLeadsResponse<T>>(
        `${API_URL}?action=get_contacts`, params);
}

export const contact_by_name_or_id = <T>(search_term: string, id?: string) => axios.post<T[]>(`${API_URL}`, new URLSearchParams({ action: 'contact_by_name_or_id', search_term, id: id ?? '' }));