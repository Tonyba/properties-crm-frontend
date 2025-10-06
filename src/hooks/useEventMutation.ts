import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { create_event } from "../api/events";
import { useModuleHeader } from "./useModuleHeader";

export const useEventMutation = () => {

    const params = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();


    return useMutation({
        mutationFn: create_event,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Events/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Activities/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`updates/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/detail/${params.leadId}/list`] })
        },
        onMutate: async ({ }) => {
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Events/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Activities/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`updates/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/detail/${params.leadId}/list`] })
        },
        onError: (e) => {
            console.log(e)
        }
    });
}