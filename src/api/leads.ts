import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { AddSelectsResponse, Agent, CreateLeadRequest, GenericResponse, GetLeadsResponse, GetSingleResponse, Lead, ListLeadRequest, SingleLeadResponse } from "../helpers/types";

export const get_selects = () => axios.post<AddSelectsResponse>(`${API_URL}?action=lead_select_values`);
export const get_agents = (agent_name?: string) => axios.post<Agent[]>(`${API_URL}?action=lead_agents`, { agent: agent_name });
export const get_lead = <T>(lead_id: string, updating?: boolean) => {
    if (typeof lead_id == 'string') {
        return axios.post<GetSingleResponse<T & GenericResponse>>(`${API_URL}?action=get_lead`, new URLSearchParams({ lead_id, updating: JSON.stringify(updating) }));
    }
    return { data: { ok: false } } as T;
}
export const leads_list = <T>(request: ListLeadRequest<T>) => {

    const params = new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })

    return axios.post<GetLeadsResponse<T>>(
        `${API_URL}?action=get_leads`, params);
}

export const create_lead = (leadData: Lead) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'new_lead', fields: JSON.stringify(leadData) }));
export const edit_lead = (leadData: Lead) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'edit_lead', fields: JSON.stringify({ ...leadData, post_type: 'lead' }) }));