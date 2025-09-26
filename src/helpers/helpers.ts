import type { QueryClient } from "@tanstack/react-query";
import type { AddSelectsResponse, SelectOption } from "./types";
import { ValidExt, validSizeInMB } from "./constants";

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

export {
    megabytesToBytes
}