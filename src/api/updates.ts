import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { GetUpdateResponseType } from "../helpers/types";

export const getUpdates = (id: string) => axios.post<GetUpdateResponseType>(`${API_URL}?action=get_updates`, new URLSearchParams({ id })); 