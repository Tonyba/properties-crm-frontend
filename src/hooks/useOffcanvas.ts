import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getFromCache } from "../helpers/helpers";
import { type OffcanvasProps } from "../helpers/types";
import { DefaultOffcanvasOpts } from "../helpers/constants";

type MutationProps = {
    queryClient: QueryClient,
    offCanvasOpts?: OffcanvasProps
}

async function handleOpen({ queryClient, offCanvasOpts }: MutationProps) {
    const cache = getFromCache<OffcanvasProps>('offcanvas', queryClient) || DefaultOffcanvasOpts;
    return { ...offCanvasOpts, open: !cache.open };
}

export const useOffcanvas = ({ queryClient, offCanvasOpts }: MutationProps) => {
    return useQuery({
        queryKey: ['offcanvas'],
        queryFn: () => {
            const cache = getFromCache<OffcanvasProps>('offcanvas', queryClient) || DefaultOffcanvasOpts;
            return cache;
        }
    });
}

export const useOffcanvasMutation = ({ queryClient, offCanvasOpts }: MutationProps) => {
    return useMutation({
        mutationFn: handleOpen,
        onSuccess: async (val) => {
            queryClient.setQueryData(['offcanvas'], offCanvasOpts ?? val);
        },

    });
}