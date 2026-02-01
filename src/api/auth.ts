
import { API_URL } from "@/helpers/constants";
import type { GenericResponse } from "@/helpers/types";
import axios from "axios";

export const login_user = (email: string, password: string) => axios.post<GenericResponse>(`${API_URL}`, new URLSearchParams({
    action: 'user_login',
    email,
    password
}));
