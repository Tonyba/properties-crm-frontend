import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { AddSelectsResponse, CreateLeadRequest, GetLeadsResponse, Lead, ListLeadRequest, SingleLeadResponse } from "../helpers/types";

export const get_selects = () => axios.post<AddSelectsResponse>(`${API_URL}?action=lead_select_values`);
export const get_agents = (agent_name: string) => axios.post<AddSelectsResponse>(`${API_URL}?action=lead_agents`, { agent: agent_name });
export const get_lead = (lead_id: string, updating: boolean) => axios.post<SingleLeadResponse>(`${API_URL}?action=get_lead`, new URLSearchParams({ lead_id, updating: updating.toString() }));
export const leads_list = (request: ListLeadRequest) => axios.post<GetLeadsResponse>(
    `${API_URL}?action=get_leads`,
    new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })
);
export const create_lead = (leadData: Lead) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'new_lead', fields: JSON.stringify(leadData) }));
export const edit_lead = (leadData: Lead) => axios.post<CreateLeadRequest>(`${API_URL}`, new URLSearchParams({ action: 'edit_lead', fields: JSON.stringify(leadData) }));