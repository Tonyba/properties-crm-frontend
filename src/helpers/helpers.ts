import type { AddSelectsResponse, SelectOption } from "./types";

export const formatSelectOpt = (label: string, value: string): SelectOption => {
    return { label, value };
}

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