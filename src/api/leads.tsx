import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { AddSelectsResponse } from "../helpers/types";

export const get_selects = () => axios.post<AddSelectsResponse>(`${API_URL}?action=lead_select_values`);
export const get_agents = (agent_name: string) => axios.post<AddSelectsResponse>(`${API_URL}?action=lead_agents`, { agent: agent_name });