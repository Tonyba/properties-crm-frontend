import type { QueryClient } from "@tanstack/react-query";
import type { AddSelectsResponse, GenericResponse, SelectOption } from "./types";
import { API_URL, ValidExt, validSizeInMB } from "./constants";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const formatSelectOpt = (label: string, value: string): SelectOption => {
    return { label, value };
}

export const getFromCache = <T>(key: string | string[], queryClient: QueryClient): T => queryClient.getQueryData(Array.isArray(key) ? key : [key]) as T;

export const formatData = (selectData: AddSelectsResponse, key: string, defaultOpts?: SelectOption[]): SelectOption[] => {
    const items = selectData[key as keyof AddSelectsResponse];
    if (items) {
        return items.map((item) => ({
            label: item.name,
            value: item.term_id.toString()
        }));
    }

    return defaultOpts || [];
}

export const bytesToMegabytes = (bytes: number) => {
    const megabytes = bytes / (1024 * 1024);
    return megabytes;
}

function megabytesToBytes(megabytes: number) {
    const bytes = megabytes * 1024 * 1024;
    return bytes;
}

export const removeFileExtFromFilename = (filename: string) => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) { // No extension found
        return filename;
    }
    return filename.substring(0, lastDotIndex);
}

export const checkValidFiles = (files: File[]) => {
    let isValid = true;

    for (const file of files) {

        const extension = file.name.split('.').pop()?.toLowerCase();

        if (!extension || !ValidExt.includes(extension)) {
            isValid = false;
            continue;
        }

        if (file.size > validSizeInMB) {
            isValid = false;
            continue;
        }

    }

    return isValid;
}

export const capitalizeFirstLetter = (str?: string) => {
    if (str?.length === 0) {
        return ""; // Handle empty strings
    }
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export const invalidateSingle = async (key: string, id: string | number, moduleSingle: string, queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: [`${key}/Tasks/${id}`] });
    await queryClient.invalidateQueries({ queryKey: [`${key}/Activities/${id}`] });
    await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Documents/${id}`] });
    await queryClient.invalidateQueries({ queryKey: [`updates/${id}`] });
    await queryClient.invalidateQueries({ queryKey: [`${key}/detail/list`] });
    await queryClient.invalidateQueries({ queryKey: [`${key}-docs/detail/list`] });
    await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/${key}/${id}`] });
    await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}-docs/detail/${id}/list`] });
    await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/detail/${id}/list`] })
}

export const handleItemDeletion = async (
    id: number,
    relationId: string,
    queryClient: QueryClient,
    key: string,
    moduleSingle?: string
) => {
    withReactContent(Swal).fire({
        title: 'Are you sure that you want to delete?',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
            try {
                if (relationId) {
                    await trashItem(id, relationId);
                    await invalidateSingle(key, relationId, moduleSingle ?? 'module', queryClient);
                }
            } catch (error) {
                Swal.showValidationMessage(`
                            Request failed: ${error}
                        `);
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Deleted!', '', 'success');
        }
    });

}

export const trashItem = async (item: number, relation: string) => axios.post<GenericResponse>(`${API_URL}?action=trash_item`, new URLSearchParams({ id: item.toString(), relation: relation.toString() }));

export const escapeHtml = (unsafe: string) => {
    return unsafe.replace(/&amp;/g, "&");
};

export {
    megabytesToBytes
}