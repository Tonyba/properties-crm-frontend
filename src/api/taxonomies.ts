import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { TaxonomiesArr } from "../helpers/types";

export const get_taxonomies_terms = (key: string) => axios.post<TaxonomiesArr>(`${API_URL}?action=${key}_taxonomies`);
