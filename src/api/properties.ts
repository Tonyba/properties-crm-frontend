import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { SearchPropertyByNameResponse } from "../helpers/types";

export const get_properties_by_name = (
    property_name?: string,
    id?: string
) => axios.post<SearchPropertyByNameResponse>(`${API_URL}?action=search_property_by_name`, new URLSearchParams({ name: property_name || '', id: id || '' }));

export const get_services = () => axios.post<SearchPropertyByNameResponse>(`${API_URL}?action=search_property_by_name`);