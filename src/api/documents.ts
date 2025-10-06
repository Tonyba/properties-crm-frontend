import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { Document, DocumentCreationResponse, GetLeadsResponse, ListLeadRequest } from "../helpers/types";

type CreateDocumentPropsType = {
    doc: Document,
    file?: File[]
}

export const create_document = ({ doc, file }: CreateDocumentPropsType) => {
    const formData = new FormData();

    formData.append('fields', JSON.stringify(doc));

    if (file?.length) formData.append('uploaded_file', file[0]);

    return axios.post<DocumentCreationResponse>(`${API_URL}?action=create_document`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const get_related_documents = <T>(id: string) => axios.post<T[]>(`${API_URL}?action=related_documents`, new URLSearchParams({ id }))

export const download_document = (file_id: string) => axios.post(`${API_URL}?action=download_document`, new URLSearchParams({ file_id }), { responseType: 'blob' })

export const get_documents_list = <T>(request: ListLeadRequest<T>) => {
    const params = new URLSearchParams({
        filters: JSON.stringify(request.filters),
        page: (request.page ?? 1).toString(),
        perPage: (request.perPage ?? 20).toString()
    })

    return axios.post<GetLeadsResponse<T>>(`${API_URL}?action=documents_list`, params);
}