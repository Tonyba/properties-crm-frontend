import { queryOptions } from "@tanstack/react-query";
import { get_lead } from "../api/leads";
import type { Lead } from "../helpers/types";

export const useSingleLead = (id: string, updating: boolean) => queryOptions({
    queryKey: [`lead/${id}`],
    queryFn: async () => {
        if (!id) return {};
        const response = await get_lead(id, updating);
        if (response.data.ok) {
            return response.data.lead;
        }
    }
});
