
import { API_URL, SEND_EMAILS_FORM_ID } from "@/helpers/constants";
import { serialize } from "@/helpers/helpers";
import type { GenericResponse } from "@/helpers/types";
import axios from "axios";

type email = {
    to: string,
    subject: string,
    content: string,
    related_id: number
}

export const sendEmail = (args: email) => axios.post<GenericResponse>(`${API_URL}`, new URLSearchParams({
    action: 'fluentform_submit',
    form_id: SEND_EMAILS_FORM_ID.toString(),
    data: serialize(args)
}));